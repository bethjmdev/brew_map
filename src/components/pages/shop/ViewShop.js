import React from "react";
import "./ViewShop.css";

function ViewShop({ showCoffeeShow, coffeeShop }) {
  console.log("coffeeShop", coffeeShop);
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
      <p>{coffeeShop.shop_name}</p>
      <p>View SHop</p>
    </div>
  );
}

export default ViewShop;
