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
    <section>
      <h2>Profile</h2>
      {profileData ? (
        <div>
          <p>
            <strong>About:</strong> {profileData.about}
          </p>
          <p>
            <strong>Favorite Cafe Drink:</strong> {profileData.cafeDrink}
          </p>
          <p>
            <strong>Favorite Cafe Milk:</strong> {profileData.cafeMilk}
          </p>
          <p>
            <strong>Preferred Cafe Temperature:</strong> {profileData.cafeTemp}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Favorite Cafe:</strong> {profileData.favCafe}
          </p>
          <p>
            <strong>First Name:</strong> {profileData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {profileData.lastName}
          </p>
          <p>
            <strong>Home Drink:</strong> {profileData.homeDrink}
          </p>
          <p>
            <strong>Home Milk:</strong> {profileData.homeMilk}
          </p>
          <p>
            <strong>Preferred Home Temperature:</strong> {profileData.homeTemp}
          </p>
          <p>
            <strong>Selected Roast:</strong> {profileData.selectedRoast}
          </p>
          <p>
            <strong>Your City:</strong> {profileData.yourCity}
          </p>
          <p>
            <strong>Active Status:</strong>{" "}
            {profileData.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <h2>User Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <p>
              <strong>Drink Rating:</strong> {review.drinkRating}
            </p>
            <p>
              <strong>Flavoring:</strong> {review.flavoring ? "Yes" : "No"}
            </p>
            <p>
              <strong>Review:</strong> {review.review}
            </p>
            <p>
              <strong>Selected Beverage:</strong> {review.selectedBev}
            </p>
            <p>
              <strong>Selected Milk:</strong> {review.selectedMilk}
            </p>
            <p>
              <strong>Selected Process:</strong> {review.selectedProcess}
            </p>
            <p>
              <strong>Selected Roast:</strong> {review.selectedRoast}
            </p>
            <p>
              <strong>Selected Temperature:</strong> {review.selectedTemp}
            </p>
            <p>
              <strong>Shop Rating:</strong> {review.shopRating}
            </p>
            <p>
              <strong>Shop Name:</strong> {review.shop_name}
            </p>
            <p>
              <strong>Staff Rating:</strong> {review.staffRating}
            </p>
            <p>
              <strong>User Name:</strong> {review.user_name_submitting}
            </p>
            <hr />
          </div>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </section>
  );
};

export default Profile;
