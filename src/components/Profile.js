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
import { db } from "../utils/auth/firebase";
import CoffeeCups from "./pages/profile/CoffeeCups";

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
        {profileData ? (
          <div>
            <h2>
              <strong>
                {profileData.firstName} {profileData.lastName}{" "}
              </strong>
            </h2>
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
            <div
              key={review.id}
              className="review-section"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                marginBottom: "1rem",
                borderRadius: "20px",
                padding: "1rem",
              }}
            >
              {review.shop_name}

              <p>
                Ordered a {review.selectedRoast} roast {review.selectedTemp}{" "}
                {review.selectedMilk}{" "}
                {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}{" "}
                that was {review.selectedProcess} processed{" "}
                {review.flavoring ? "with flavoring" : " "}
              </p>

              <p>
                <strong>Drink Rating</strong>{" "}
                <CoffeeCups rating={review.drinkRating} maxCups={5} />
              </p>

              <p>
                <strong>Shop Rating</strong>{" "}
                <CoffeeCups rating={review.shopRating} maxCups={5} />
              </p>

              <p>
                <strong>Staff Rating</strong>{" "}
                <CoffeeCups rating={review.staffRating} maxCups={5} />
              </p>
              <p>
                <strong>Review:</strong> {review.review}
              </p>
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
