import React, { useEffect } from "react";
import "./ViewShop.css";
import CoffeeCups from "../../pages/profile/CoffeeCups";

function ViewShop({ showCoffeeShow, coffeeShop, shopReviews }) {
  useEffect(() => {
    console.log("shopReviews updated:", shopReviews);
  }, [shopReviews]);

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
      <div className="view-shop-container">
        <div className="exit-shop">
          <a onClick={showCoffeeShow}>X</a>
        </div>
        <p id="title">{coffeeShop.shop_name}</p>

        <div className="shop-images">
          <a style={{ backgroundColor: "#806D5B" }} id="photo1">
            image
          </a>
          <div className="shop-images-column">
            <a style={{ backgroundColor: "#B3A89D" }} id="photo2">
              image1
            </a>
            <a style={{ backgroundColor: "#4F3E31" }} id="photo3">
              image2
            </a>
          </div>
        </div>

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
            {coffeeShop.typical_roast_style}
          </p>
          <p>
            <strong>Most Popular Beverage:</strong>{" "}
          </p>
        </div>
        <div className="shop-review-section">
          <h2>Shop Reviews</h2>
          {shopReviews && shopReviews.length > 0 ? (
            shopReviews.map((review) => (
              <div key={review.id} className="shop-ind-review">
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
                <p>View photos</p>
                <p>
                  <strong>
                    Review <br />
                  </strong>
                  {review.review}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews Be the first person to leave one</p>
          )}
        </div>
        <p>Shop Submitted by: {coffeeShop.user_name_submitting}</p>
      </div>
    </div>
  );
}

export default ViewShop;
