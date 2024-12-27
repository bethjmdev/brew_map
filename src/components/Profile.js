import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
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
  const currentUser = auth.currentUser;
  const [brewBadge, setBrewBadge] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coffeeCity, setCoffeeCity] = useState("");
  const [coffeeState, setCoffeeState] = useState("");

  const cafeBadges = [
    `Bean Scout`,
    `Brew Pathfinder`,
    `Espresso Explorer`,
    `Caffeine Pioneer`,
  ];

  const photoBadges = [
    `Caffeine Shutterbug`,
    `Snapshot Sipper`,
    `Latte Luminary`,
    `Brewtiful Visionary`,
  ];

  const reviewBadges = [
    `Percolating Critic`,
    `Grounded Reviewer`,
    `Brewmaster Critic`,
    `Cupping Connoisseur`,
  ];

  const getCafeBadge = (cafes) => {
    if (cafes >= 1 && cafes < 5) return cafeBadges[0];
    if (cafes >= 5 && cafes < 10) return cafeBadges[1];
    if (cafes >= 10 && cafes < 20) return cafeBadges[2];
    if (cafes >= 20) return cafeBadges[3];
    return null;
  };

  const getPhotoBadge = (photos) => {
    if (photos >= 1 && photos < 5) return photoBadges[0];
    if (photos >= 5 && photos < 15) return photoBadges[1];
    if (photos >= 15 && photos < 25) return photoBadges[2];
    if (photos >= 25) return photoBadges[3];
    return null;
  };

  const getReviewBadge = (reviews) => {
    if (reviews >= 1 && reviews < 5) return reviewBadges[0];
    if (reviews >= 5 && reviews < 10) return reviewBadges[1];
    if (reviews >= 10 && reviews < 20) return reviewBadges[2];
    if (reviews >= 20) return reviewBadges[3];
    return null;
  };

  const copyFollowLink = () => {
    if (!currentUser || !profileData) return;

    const encodedUserId = btoa(currentUser.uid);
    const lastFourDigits = currentUser.uid.slice(-4);
    const userName = profileData.firstName + profileData.lastName;
    const followLink = `${window.location.origin}/otheruser/${lastFourDigits}-${userName}?uid=${encodedUserId}`;

    navigator.clipboard
      .writeText(followLink)
      .then(() => {
        alert("Follow link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying link:", error);
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "BrewUsers", currentUser.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      if (currentUser) {
        try {
          const q = query(
            collection(db, "BrewBadges"),
            where("id", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => setBrewBadge(doc.data()));
          }
        } catch (error) {
          console.error("Error fetching user badges:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (currentUser) {
        try {
          const reviewRef = collection(db, "ShopReviews");
          const q = query(
            reviewRef,
            where("userID_submitting", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);

          const reviewList = [];
          querySnapshot.forEach((doc) => {
            reviewList.push({ id: doc.id, ...doc.data() });
          });

          setReviews(reviewList);
        } catch (error) {
          console.error("Error fetching user reviews:", error);
        }
      }
    };

    fetchUserReviews();
  }, [currentUser]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const handleSubmit = async () => {
  //   console.log("User input:", coffeeCity, coffeeState);

  //   try {
  //     // Create a query to fetch matching coffee shops
  //     const q = query(
  //       collection(db, "CoffeeShops"),
  //       where("city", "==", coffeeCity.toUpperCase()), // Ensure consistency with stored data
  //       where("state", "==", coffeeState.toUpperCase()) // Ensure consistency with stored data
  //     );

  //     // Execute the query and retrieve the documents
  //     const querySnapshot = await getDocs(q);

  //     // Check if any documents are found
  //     if (!querySnapshot.empty) {
  //       const coffeeShops = [];
  //       querySnapshot.forEach((doc) => {
  //         coffeeShops.push({ id: doc.id, ...doc.data() });
  //       });

  //       // Log the results to the console
  //       console.log("Coffee Shops:", coffeeShops);
  //     } else {
  //       console.log("No coffee shops found for the given city and state.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching coffee shops:", error);
  //   }
  // };

  const handleSubmit = async () => {
    console.log("User input:", coffeeCity, coffeeState);

    try {
      // Step 1: Fetch all coffee shops matching the city and state
      const shopQuery = query(
        collection(db, "CoffeeShops"),
        where("city", "==", coffeeCity.toUpperCase()),
        where("state", "==", coffeeState.toUpperCase())
      );
      const shopSnapshot = await getDocs(shopQuery);

      if (!shopSnapshot.empty) {
        const shopIds = [];
        shopSnapshot.forEach((doc) => {
          shopIds.push(doc.id);
        });

        console.log("Matching shop IDs:", shopIds);

        // Step 2: Fetch all reviews for the matching shop IDs
        const reviewPromises = shopIds.map(async (shopId) => {
          const reviewQuery = query(
            collection(db, "ShopReviews"),
            where("shop_id", "==", shopId)
          );
          const reviewSnapshot = await getDocs(reviewQuery);
          const reviews = [];
          reviewSnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
          });
          return reviews;
        });

        // Wait for all review queries to complete
        const allReviews = (await Promise.all(reviewPromises)).flat();

        // Log all reviews to the console
        console.log("All Matching Reviews:", allReviews);
      } else {
        console.log("No coffee shops found for the given city and state.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
            <button onClick={handleOpenModal}>
              Get Custom Coffee Shop reccomendations
            </button>
            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <p>Where do you want your coffee reccomendations from?</p>
                  <p>
                    <i>
                      You can only request one custom recommendation per day.
                      We’ll generate six tailored recommendations for the
                      location of your choice, all in one go!
                    </i>
                  </p>
                  <input
                    type="text"
                    value={coffeeCity}
                    placeholder="City you want the recc in- ex. Portland"
                    onChange={(e) => setCoffeeCity(e.target.value)}
                  />
                  <br />
                  <br />
                  <input
                    type="text"
                    value={coffeeState}
                    placeholder="State you want the rec in- ex: ME"
                    onChange={(e) => {
                      const input = e.target.value.toUpperCase().slice(0, 2); // Uppercase and limit to 2 characters
                      setCoffeeState(input);
                    }}
                  />
                  <div className="modal-buttons">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleCloseModal}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <button onClick={copyFollowLink}>Copy Follow Link</button>
            <p>
              <strong>Favorite Cafe Drink:</strong> A {profileData.cafeTemp}{" "}
              {profileData.cafeMilk}{" "}
              {profileData.cafeMilk !== "Black" && "Milk"}{" "}
              {profileData.cafeDrink}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <h2>Badges</h2>
        <p>
          {brewBadge
            ? [
                getCafeBadge(brewBadge.cafes),
                getPhotoBadge(brewBadge.photos),
                getReviewBadge(brewBadge.reviews),
              ]
                .filter(Boolean)
                .join(", ") || "No badges yet!"
            : "Loading badges..."}
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
              <p>{review.review}</p>
              <p className="ratings-profile">
                <strong>Drink Rating</strong>{" "}
                <CoffeeCups rating={review.drinkRating} maxCups={5} />
              </p>
              <p className="ratings-profile">
                <strong>Shop Rating</strong>{" "}
                <CoffeeCups rating={review.shopRating} maxCups={5} />
              </p>
              <p className="ratings-profile">
                <strong>Staff Rating</strong>{" "}
                <CoffeeCups rating={review.staffRating} maxCups={5} />
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
