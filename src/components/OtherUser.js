import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../utils/auth/firebase";
import CoffeeCups from "./pages/profile/CoffeeCups";
import "./Profile.css";

const OtherUser = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [brewBadge, setBrewBadge] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "BrewUsers", id));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          console.log("No such user document!");
        }

        const q = query(collection(db, "BrewBadges"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => setBrewBadge(doc.data()));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const reviewRef = collection(db, "ShopReviews");
        const q = query(reviewRef, where("userID_submitting", "==", id));
        const querySnapshot = await getDocs(q);

        const reviewList = [];
        querySnapshot.forEach((doc) =>
          reviewList.push({ id: doc.id, ...doc.data() })
        );
        setReviews(reviewList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, [id]);

  return (
    <div className="profile">
      <div className="profile-container">
        {profileData ? (
          <div>
            <h2>
              <strong>
                {profileData.firstName} {profileData.lastName}
              </strong>
            </h2>
            <p>
              <strong>Favorite Cafe Drink:</strong> A {profileData.cafeTemp}{" "}
              {profileData.cafeMilk}{" "}
              {profileData.cafeMilk !== "Black" && "Milk"}{" "}
              {profileData.cafeDrink}
            </p>
            <p>{profileData.about}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <h2>Badges</h2>
        <p>
          {brewBadge
            ? [
                brewBadge.cafes >= 1 && brewBadge.cafes < 5
                  ? "Bean Scout"
                  : null,
                brewBadge.photos >= 1 && brewBadge.photos < 5
                  ? "Snapshot Sipper"
                  : null,
                brewBadge.reviews >= 1 && brewBadge.reviews < 5
                  ? "Percolating Critic"
                  : null,
              ]
                .filter(Boolean)
                .join(", ")
            : "No badges yet!"}
        </p>

        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-section">
              <h3>{review.shop_name}</h3>
              <p>
                Ordered a {review.selectedTemp} {review.selectedMilk}{" "}
                {review.selectedMilk !== "Black" && "Milk"} {review.selectedBev}
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

export default OtherUser;
