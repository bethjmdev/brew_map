import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  orderBy,
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

  const [isReccModalOpen, setIsReccModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [coffeeCity, setCoffeeCity] = useState("");
  const [coffeeState, setCoffeeState] = useState("");
  const [finalFilteredReviews, setFinalFilteredReviews] = useState([]);

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
        alert(
          "Follow link copied to clipboard! Send to your friends so they can follow you!"
        );
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

  const handleOpenReccModal = () => {
    setIsReccModalOpen(true);
  };

  const handleCloseReccModal = () => {
    setIsReccModalOpen(false);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
  };

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
        const shopDetails = {};

        shopSnapshot.forEach((doc) => {
          shopIds.push(doc.id);
          shopDetails[doc.id] = { ...doc.data() };
        });

        console.log("Matching shop IDs:", shopIds);

        // Step 2: Fetch all reviews for the matching shop IDs in a single query
        const reviewQuery = query(
          collection(db, "ShopReviews"),
          where("shop_id", "in", shopIds)
        );
        const reviewSnapshot = await getDocs(reviewQuery);

        const allReviews = [];
        reviewSnapshot.forEach((doc) => {
          const reviewData = { id: doc.id, ...doc.data() };
          const shop = shopDetails[reviewData.shop_id];

          if (shop) {
            reviewData.shop_name = shop.shop_name;
            reviewData.street_address = shop.street_address;
            reviewData.city = shop.city;
            reviewData.state = shop.state;
          }

          allReviews.push(reviewData);
        });

        console.log("All Matching Reviews:", allReviews);

        // Step 3: Filter reviews based on user preferences
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "BrewUsers", currentUser.uid));
          if (userDoc.exists()) {
            const { cafeDrink, cafeMilk, cafeTemp, selectedRoast } =
              userDoc.data();

            console.log("Current User Preferences:", {
              cafeDrink,
              cafeMilk,
              cafeTemp,
              selectedRoast,
            });

            const finalFilteredReviews = allReviews
              .filter(
                (review) =>
                  review.selectedRoast === selectedRoast &&
                  review.selectedBev === cafeDrink &&
                  review.selectedTemp === cafeTemp &&
                  review.drinkRating >= 4 &&
                  review.userID_submitting !== currentUser.uid
              )
              .reduce((unique, review) => {
                if (!unique[review.shop_id]) unique[review.shop_id] = review;
                return unique;
              }, {});

            const recommendations = Object.values(finalFilteredReviews);

            setIsReccModalOpen(false);

            // Handle results
            if (recommendations.length === 0) {
              alert(
                "Not enough shops with your preferences to make a recommendation. Sorry!"
              );
            } else {
              setFinalFilteredReviews(recommendations);

              setIsListModalOpen(true);
              console.log("Final Recommendations:", recommendations);
            }
          } else {
            console.log("No user data found for the current user.");
          }
        }
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
            <div className="profile_buttons">
              <button onClick={handleOpenReccModal} id="custom_button">
                Custom Coffee Shop Recc
              </button>
              <br />
              <button onClick={copyFollowLink} id="custom_button">
                Copy Follow Link
              </button>
            </div>

            {isReccModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <p>
                    <strong>
                      What city do you want your coffee shop reccomendations in?
                    </strong>
                  </p>
                  {/* <p>
                    You can only request one custom recommendation per day.
                    We’ll generate six tailored recommendations for the location
                    of your choice, all in one go!
                  </p> */}
                  <p>
                    <i>
                      Our reccomendations are based on user reviews. So! If
                      there arent 6 - or any - locations listed it means we
                      don't have enough reviews in that city that match with
                      your preferences... encourage your friends to add reviews
                      so we can improve up our reccomendations!!!
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
                    <button onClick={handleCloseReccModal}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {isListModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Your Custom Reccomendations</h2>
                  <p>
                    <i>Make sure to save this list to reference later</i>
                  </p>
                  {finalFilteredReviews.map((review) => (
                    <>
                      <p key={review.id}>
                        {review.shop_name} @ {review.street_address}
                      </p>
                    </>
                  ))}
                  <div className="modal-buttons">
                    <button
                      onClick={() => {
                        const listText = finalFilteredReviews
                          .map(
                            (review) =>
                              `${review.shop_name} @ ${review.street_address}, ${review.city}, ${review.state}`
                          )
                          .join("\n");
                        navigator.clipboard
                          .writeText(listText)
                          .then(() => {
                            alert("List copied to clipboard!");
                          })
                          .catch((err) => {
                            console.error("Failed to copy list:", err);
                          });
                      }}
                    >
                      Copy List
                    </button>
                    <button onClick={handleCloseListModal}>Close</button>
                  </div>
                </div>
              </div>
            )}

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
          [...reviews]
            .sort((a, b) => {
              const dateA = a.timestamp.toDate(); // Convert Firestore Timestamp to Date
              const dateB = b.timestamp.toDate(); // Convert Firestore Timestamp to Date
              return dateB - dateA; // Sort by date in descending order
            })
            .map((review) => (
              <div key={review.id} className="review-section">
                <h3>{review.shop_name}</h3>
                <p>
                  Ordered a {review.selectedTemp} {review.selectedMilk}{" "}
                  {review.selectedMilk !== "Black" && "Milk"}{" "}
                  {review.selectedBev}
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
