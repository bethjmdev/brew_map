import React, { useEffect } from "react";
import "./ViewShop.css";

function ViewShop({ showCoffeeShow, coffeeShop, shopReviews }) {
  useEffect(() => {
    console.log("shopReviews updated:", shopReviews);
  }, [shopReviews]);

  return (
    <div
      style={{
        backgroundColor: "var(--white)",
        height: "100vh",
        width: "40rem",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 99,
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <p onClick={showCoffeeShow}>X</p>
      {/* <p>{coffeeShop.shop_name}</p> */}
      <p>{coffeeShop ? coffeeShop.shop_name : "Loading..."}</p>

      <h2>shop Reviews</h2>
      {shopReviews && shopReviews.length > 0 ? (
        shopReviews.map((review) => (
          <div key={review.id}>
            <p>{review.user_name_submitting}'s fav drnk is...</p>
            <p>
              {review.user_name_submitting} got drnk {review.selectedTemp}{" "}
              {review.selectedMilk} {review.selectedBev} that was{" "}
              {review.selectedProcess} process and {review.selectedRoast} roast
            </p>

            <p>{review.review}</p>
          </div>
        ))
      ) : (
        <p>No reviews Be the first person to leave one</p>
      )}
    </div>
  );
}

export default ViewShop;
