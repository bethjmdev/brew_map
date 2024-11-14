import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../utils/auth/firebase"; // Ensure correct Firebase imports
import "./Profile.css";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get the current user

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "BrewUsers", currentUser.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const readUserReviews = async () => {
      if (!currentUser) return;

      const reviewRef = collection(db, "ShopReviews");
      // Adjusted query to check for userID_submitting instead of participants
      const q = query(
        reviewRef,
        where("userID_submitting", "==", currentUser.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const reviewList = [];

        querySnapshot.forEach((doc) => {
          reviewList.push({ id: doc.id, ...doc.data() });
        });

        // Update reviews state with the fetched reviews
        setReviews(reviewList);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    readUserReviews();
  }, [currentUser]);

  return (
    <div className="profile">
      <div className="profile-container">
        <h2>Profile</h2>
        {profileData ? (
          <div>
            <p>
              <strong>Name:</strong> {profileData.firstName}{" "}
              {profileData.lastName}
            </p>
            <p>
              <strong>Favorite Cafe Drink:</strong> A {profileData.cafeTemp}{" "}
              {profileData.cafeMilk}{" "}
              {profileData.cafeMilk !== "Black" && "Milk"}{" "}
              {profileData.cafeDrink}
            </p>

            <p>
              <strong>Favorite at Home Drink:</strong> A {profileData.homeTemp}{" "}
              {profileData.homeDrink} {profileData.homeMilk}{" "}
              {profileData.homeMilk !== "Black" && "Milk"}{" "}
            </p>
            <p>
              {profileData.firstName}'s favorite cafe is {profileData.favCafe}{" "}
              and preferred roast is {profileData.selectedRoast}.
            </p>
            <p>{profileData.about}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <h2>Reviews Section</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id}>
              {review.shop_name}

              <p>
                Ordered a {review.selectedRoast} roast {review.selectedTemp}{" "}
                {review.selectedMilk}{" "}
                {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}{" "}
                that was {review.selectedProcess} processed{" "}
                {review.flavoring ? "with flavoring" : " "}
              </p>

              <p>
                <strong>Drink Rating:</strong> {review.drinkRating}
              </p>

              <p>
                <strong>Shop Rating:</strong> {review.shopRating}
              </p>
              <p>
                <strong>Staff Rating:</strong> {review.staffRating}
              </p>
              <p>
                <strong>Review:</strong> {review.review}
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
