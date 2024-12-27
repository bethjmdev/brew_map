import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../utils/auth/firebase";

const FriendsReviews = () => {
  const [friends, setFriends] = useState([]);
  const [reviews, setReviews] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser) {
        try {
          // Query the Friends collection for the document where id === currentUser.uid
          const q = query(
            collection(db, "Friends"),
            where("id", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const friendsDoc = querySnapshot.docs[0]; // Assuming one document per user
            const friendsData = friendsDoc.data();

            if (friendsData.friends && Array.isArray(friendsData.friends)) {
              setFriends(friendsData.friends);
            } else {
              console.log("No friends array found in the document.");
            }
          } else {
            console.log("No Friends document found for the current user.");
          }
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    fetchFriends();
  }, [currentUser]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (friends.length > 0) {
        try {
          const reviewRef = collection(db, "ShopReviews");
          const reviewsList = [];
          const now = new Date();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          // Fetch reviews for each friend ID
          for (const friendId of friends) {
            const q = query(
              reviewRef,
              where("userID_submitting", "==", friendId)
            ); // Single condition
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
              const reviewData = doc.data();

              // Filter reviews locally for last 30 days
              if (
                reviewData.timestamp &&
                typeof reviewData.timestamp.toMillis === "function" &&
                reviewData.timestamp.toMillis() > thirtyDaysAgo.getTime()
              ) {
                reviewsList.push({ id: doc.id, ...reviewData });
              }
            });
          }

          // Sort manually in descending order based on timestamp
          reviewsList.sort(
            (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
          );
          setReviews(reviewsList);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [friends]);

  return (
    <div>
      <h2>Friends' Reviews (Last 30 Days)</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-section">
            <h3>{review.shop_name}</h3>
            <p>
              Reviewed by: <strong>{review.user_name_submitting}</strong>
            </p>
            <p>
              Ordered a {review.selectedTemp} {review.selectedMilk}{" "}
              {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}
            </p>
            <p>{review.review}</p>
            <p>
              <strong>Drink Rating:</strong> {review.drinkRating}/5
            </p>
            <p>
              <strong>Shop Rating:</strong> {review.shopRating}/5
            </p>
            <p>
              <strong>Staff Rating:</strong> {review.staffRating}/5
            </p>
            <p>
              <small>
                Reviewed on:{" "}
                {new Date(review.timestamp.toMillis()).toLocaleString()}
              </small>
            </p>
          </div>
        ))
      ) : (
        <p>No reviews found from your friends in the last 30 days.</p>
      )}
    </div>
  );
};

export default FriendsReviews;
