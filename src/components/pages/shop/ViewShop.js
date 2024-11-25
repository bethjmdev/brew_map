import React, { useEffect } from "react";
import "./ViewShop.css";

function ViewShop({ showCoffeeShow, coffeeShop, shopReviews }) {
  useEffect(() => {
    console.log("shopReviews updated:", shopReviews);
  }, [shopReviews]);

  return (
    <div className="view-shop">
      <div className="view-shop-container">
        <div className="exit-shop">
          <p onClick={showCoffeeShow}>X</p>
        </div>
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
        <p>{coffeeShop ? coffeeShop.shop_name : "Loading..."}</p>

        <div className="shop-review-container">
          <h2>Shop Reviews</h2>
          {shopReviews && shopReviews.length > 0 ? (
            shopReviews.map((review) => (
              <div key={review.id} className="shop-ind-review">
                <p>
                  {review.user_name_submitting}'s fav drink is{" "}
                  {review.user_fav_temp} {""}
                  {review.user_fav_milk} {review.user_fav_drink} that is{" "}
                  {review.user_fav_roast} roast
                </p>
                <p>
                  The drink {review.user_name_submitting} was{" "}
                  {review.selectedTemp} {review.selectedMilk}{" "}
                  {review.selectedBev} that was{" "}
                  {/* {review.selectedProcess} process  */}
                  and {review.selectedRoast} roast
                </p>

                <p>{review.review}</p>
              </div>
            ))
          ) : (
            <p>No reviews Be the first person to leave one</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewShop;
