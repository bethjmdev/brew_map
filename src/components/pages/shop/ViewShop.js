import React, { useEffect, useState } from "react";
import "./ViewShop.css";
import CoffeeCups from "../../pages/profile/CoffeeCups";
import ShopImages from "./ShopImages";

function ViewShop({ showCoffeeShow, coffeeShop, shopReviews, navigate }) {
  const [photoViewer, setPhotoViewer] = useState({ isOpen: false, photos: [] });
  const isVertical = (width, height) => height > width;

  useEffect(() => {
    console.log("shopReviews updated:", shopReviews);
  }, [shopReviews]);

  const openPhotoViewer = (photos) => {
    setPhotoViewer({ isOpen: true, photos });
  };

  const closePhotoViewer = () => {
    setPhotoViewer({ isOpen: false, photos: [] });
  };

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
            <strong>Address:</strong>
            {coffeeShop.street_address} {coffeeShop.city}, {coffeeShop.state}
          </p>
          <p>
            <strong>Hours:</strong> {coffeeShop.hours}
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
            <strong>Typical Roast Style:</strong>{" "}
            {coffeeShop.roast_style}
          </p>
          <p>
            <strong>Most Popular Beverage:</strong>{" "}
          </p>

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
        </div>
        <div className="shop-review-section">
          {shopReviews && shopReviews.length > 0 ? (
            shopReviews.map((review) => (
              <div key={review.id} className="shop-ind-review">
                <h2>Shop Reviews</h2>
                <p id="reviewer-name">
                  <strong>{review.user_name_submitting}</strong>
                </p>
                <p>
                  <strong>Favorite drink</strong>
                  <br />A {review.user_fav_temp} {""}
                  {review.user_fav_milk}{" "}
                  {review.user_fav_milk !== "Black" && "Milk"}{" "}
                  {review.user_fav_drink} that is {review.user_fav_roast} roast
                </p>
                <p>
                  <strong>Ordered</strong>
                  <br /> A {review.selectedTemp} {review.selectedMilk}{" "}
                  {review.selectedMilk !== "Black" && "Milk"}{" "}
                  {review.selectedBev} that was a {review.selectedRoast} roast
                  and {review.selectedProcess} processed{" "}
                  {review.flavoring ? "with flavoring" : " "}
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
