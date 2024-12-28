import React, { useEffect, useState } from "react";
import "./ViewShop.css";
import CoffeeCups from "../../pages/profile/CoffeeCups";
import ShopImages from "./ShopImages";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utils/auth/firebase";

function ViewShop({
  showCoffeeShow,
  coffeeShop,
  shopReviews,
  coffeeBags,
  navigate,
}) {
  const [photoViewer, setPhotoViewer] = useState({ isOpen: false, photos: [] });
  const [badges, setBadges] = useState({}); // Store badges for users
  const [mostCommonCombinationDetails, setMostCommonCombinationDetails] =
    useState(null);
  const isVertical = (width, height) => height > width;

  useEffect(() => {
    console.log("shopReviews updated:", shopReviews);
  }, [shopReviews]);

  // Fetch BrewBadges data and store in a dictionary for quick lookup
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const badgeCollection = collection(db, "BrewBadges");
        const badgeSnapshot = await getDocs(badgeCollection);

        const badgeData = {};
        badgeSnapshot.forEach((doc) => {
          const data = doc.data();
          badgeData[data.id] = data; // Use the `id` field as the key
        });

        setBadges(badgeData);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchBadges();
  }, [shopReviews]);

  // Helper functions for badge logic
  const getCafeBadge = (cafes) => {
    if (cafes >= 1 && cafes < 5) return `Bean Scout`;
    if (cafes >= 5 && cafes < 10) return `Brew Pathfinder`;
    if (cafes >= 10 && cafes < 20) return `Espresso Explorer`;
    if (cafes >= 20) return `Caffeine Pioneer`;
    return null;
  };

  const getPhotoBadge = (photos) => {
    if (photos >= 1 && photos < 5) return `Coffee Photographer`;
    if (photos >= 5 && photos < 15) return `Snapshot Sipper`;
    if (photos >= 15 && photos < 25) return `Latte Lens`;
    if (photos >= 25) return `Coffee Cameraman`;
    return null;
  };

  const getReviewBadge = (reviews) => {
    if (reviews >= 1 && reviews < 5) return `Percolating Critic`;
    if (reviews >= 5 && reviews < 10) return `Grounded Reviewer`;
    if (reviews >= 10 && reviews < 20) return `Brewmaster Critic`;
    if (reviews >= 20) return `Caffeinated Maven`;
    return null;
  };

  // console.log("shop id", coffeeShop.shop_id);
  // Render badges based on user data
  const renderBadges = (userId) => {
    const userBadges = badges[userId];
    if (!userBadges) return "No badges"; // Default message if no badges found

    const badgeList = [
      getCafeBadge(userBadges.cafes),
      getPhotoBadge(userBadges.photos),
      getReviewBadge(userBadges.reviews),
    ]
      .filter(Boolean) // Remove null or undefined badges
      .join(", ");

    return badgeList || "No badges";
  };

  const openPhotoViewer = (photos) => {
    setPhotoViewer({ isOpen: true, photos });
  };

  const closePhotoViewer = () => {
    setPhotoViewer({ isOpen: false, photos: [] });
  };

  const printHighRatedReviews = (reviews) => {
    if (!reviews || reviews.length === 0) {
      console.log("No reviews available.");
      return;
    }

    const highRatedReviews = reviews.filter(
      (review) => review.drinkRating >= 4
    );

    if (highRatedReviews.length === 0) {
      console.log("No reviews with a rating of 4 or higher.");
    } else {
      console.log("High-rated reviews:");
      highRatedReviews.forEach((review, index) => {
        console.log(`Review ${index + 1}:`, review);
      });
    }
  };

  const findMostCommonReviewString = (reviews) => {
    if (!reviews || reviews.length === 0) {
      console.log("No reviews available.");
      return;
    }

    const highRatedReviews = reviews.filter(
      (review) => review.drinkRating >= 4
    );

    if (highRatedReviews.length === 0) {
      console.log("No reviews with a rating of 4 or higher.");
      return;
    }

    // Combine fields into normalized strings
    const combinedStrings = highRatedReviews.map((review) => {
      const selectedTemp =
        review.selectedTemp?.toLowerCase().trim() || "unknown";
      const selectedMilk =
        review.selectedMilk?.toLowerCase().trim() || "unknown";
      const selectedBev = review.selectedBev?.toLowerCase().trim() || "unknown";
      const selectedRoast =
        review.selectedRoast?.toLowerCase().trim() || "unknown";
      const selectedProcess =
        review.selectedProcess?.toLowerCase().trim() || "unknown";

      return `${selectedTemp} ${selectedMilk} ${selectedBev} ${selectedRoast} ${selectedProcess}`;
    });

    // Check if all strings are "unknown unknown unknown unknown unknown"
    if (
      combinedStrings.every(
        (string) => string === "unknown unknown unknown unknown unknown"
      )
    ) {
      console.log("No top-rated drink.");
      return;
    }

    // Count occurrences of each string
    const countMap = combinedStrings.reduce((acc, string) => {
      acc[string] = (acc[string] || 0) + 1;
      return acc;
    }, {});

    // Find the highest occurrence
    const maxCount = Math.max(...Object.values(countMap));
    const mostCommonStrings = Object.keys(countMap).filter(
      (string) => countMap[string] === maxCount
    );

    // Randomly select one if there's a tie
    const selectedString =
      mostCommonStrings.length > 1
        ? mostCommonStrings[
            Math.floor(Math.random() * mostCommonStrings.length)
          ]
        : mostCommonStrings[0];

    console.log("Most common drink:", selectedString);
  };

  // Example of using this function in your ViewShop component
  useEffect(() => {
    findMostCommonReviewString(shopReviews);
  }, [shopReviews]);

  //--------------------
  if (!coffeeShop) {
    return (
      <div className="view-shop">
        <div className="view-shop-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-shop">
      {photoViewer.isOpen && (
        <div className="photo-viewer-overlay">
          <button className="close-button" onClick={closePhotoViewer}>
            Close
          </button>
          <div className="photo-scroll-container">
            {photoViewer.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
                className={`photo-item`}
                onLoad={(e) => {
                  const img = e.target;
                  const isPortrait = isVertical(
                    img.naturalWidth,
                    img.naturalHeight
                  );
                  img.style.height = isPortrait ? "80vh" : "60vh";
                  img.style.width = isPortrait ? "auto" : "90%";
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="view-shop-container">
        <div className="exit-shop">
          <a onClick={showCoffeeShow}>X</a>
        </div>
        <p id="title">{coffeeShop.shop_name}</p>

        <ShopImages coffeeShop={coffeeShop} openPhotoViewer={openPhotoViewer} />

        <div className="about-coffee-shop">
          <p>
            {coffeeShop.about && (
              <p>
                <strong>About: </strong>
                {coffeeShop.about}
              </p>
            )}
          </p>
          <p>
            <strong>Address:</strong>
            {coffeeShop.street_address} {coffeeShop.city}, {coffeeShop.state}
          </p>
          <p>
            <strong>Hours:</strong> {coffeeShop.hours} <i>(hours may vary)</i>
          </p>
          <p>
            <strong>Roasts own beans?</strong>{" "}
            {coffeeShop.roasts_own_beans ? "Yes" : "No"}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href={coffeeShop.website}>{coffeeShop.website}</a>
          </p>
          <p>
            <strong>Types of Beverages Served:</strong>{" "}
            {coffeeShop.types_of_beverages.map((beverage, index) => (
              <span key={index}>
                {beverage}
                {index < coffeeShop.types_of_beverages.length - 1 && ", "}
              </span>
            ))}
          </p>
          <p>
            <strong>Typical Flavor Notes:</strong>{" "}
            {coffeeShop.typical_flavor_notes}
          </p>
          <p>
            <strong>Typical Roast Style:</strong> {coffeeShop.roast_style}
          </p>

          {/* {mostCommonCombinationDetails ? (
            <p>
              <strong>Most popular drink based on reviews:</strong>
              <br /> A {mostCommonCombinationDetails.selectedTemp}{" "}
              {mostCommonCombinationDetails.selectedMilk}{" "}
              {mostCommonCombinationDetails.selectedMilk !== "Black" && "Milk"}{" "}
              {mostCommonCombinationDetails.selectedBev} that is a{" "}
              {mostCommonCombinationDetails.selectedRoast} Roast and{" "}
              {mostCommonCombinationDetails.selectedProcess} processed{" "}
              {mostCommonCombinationDetails.flavoring ? "with flavoring" : " "}
            </p>
          ) : (
            <p>Loading...</p>
          )} */}

          <div className="options-available">
            <h2>Options Available</h2>
            <p>
              <strong>Dairy Free Options: </strong>
              {coffeeShop.dairy_free ? " Yes" : " No"}
            </p>
            <p>
              <strong>Gluten Friendly Options:</strong>
              {coffeeShop.gluten_friendly ? " Yes" : " No"}
            </p>
            <p>
              <strong>Bakery Items:</strong>
              {coffeeShop.bakery_options ? " Yes" : " No"}
            </p>
            <p>
              <strong>Serves Meals:</strong>
              {coffeeShop.meal_options ? " Yes" : " No"}
            </p>
          </div>
          <div className="options-available">
            <h2>Beans Available</h2>

            <ul>
              {coffeeBags.flatMap((coffee) =>
                coffee.coffee_bags.map((name) => (
                  <li key={name}>
                    {name
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="shop-review-section">
          <h2>Shop Reviews</h2>
          {shopReviews && shopReviews.length > 0 ? (
            shopReviews.map((review) => (
              <div key={review.id} className="shop-ind-review">
                <p
                  id="reviewer-name"
                  onClick={() =>
                    navigate(
                      `/otheruser/${review.userID_submitting.slice(-4)}-${
                        review.user_name_submitting
                      }`,
                      {
                        state: { userId: review.userID_submitting },
                      }
                    )
                  }
                >
                  <strong>{review.user_name_submitting}</strong>
                </p>

                <strong></strong>
                <p>
                  <i> {renderBadges(review.userID_submitting)}</i>
                </p>
                <br />
                <p>
                  <strong>Favorite drink</strong>
                  <br />A {review.user_fav_temp} {""}
                  {review.user_fav_milk}{" "}
                  {review.user_fav_milk !== "Black" && "Milk"}{" "}
                  {review.user_fav_drink} that is {review.user_fav_roast} roast
                </p>
                <p>
                  <strong>Ordered</strong>
                  <br /> A {review.selectedTemp} {review.selectedBev}{" "}
                  {review.selectedMilk}{" "}
                  {review.selectedMilk !== "Black" && "Milk"} that was a{" "}
                  {review.selectedRoast} roast and {review.selectedProcess}{" "}
                  processed {review.flavoring ? "with flavoring" : " "}
                </p>
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

                {review.photo_urls ? (
                  <a onClick={() => openPhotoViewer(review.photo_urls)}>
                    View photos
                  </a>
                ) : (
                  " "
                )}

                <p>
                  <strong>
                    Review <br />
                  </strong>
                  {review.review}
                </p>
              </div>
            ))
          ) : (
            <h2 style={{ width: "80%" }}>
              No reviews, be the first person to leave one
            </h2>
          )}
        </div>
        <p style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
          Shop Submitted by:{" "}
          {coffeeShop.user_name_submitting ? (
            <>{coffeeShop.user_name_submitting}</>
          ) : (
            " "
          )}
        </p>
      </div>
    </div>
  );
}

export default ViewShop;
