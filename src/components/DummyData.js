import React from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure your Firebase config is correctly set up

const shopData = [
  {
    shop_id: "169566085148",
    shop_name: "Caffe Nero",
    address: "100 Huntington Ave",
  },
  {
    shop_id: "231313632639",
    shop_name: "Render Coffee",
    address: "563 Columbus Ave",
  },
  {
    shop_id: "280844925554",
    shop_name: "Pavement Coffee House",
    address: "286 Newbury St",
  },
  {
    shop_id: "478731192639",
    shop_name: "Thinking Cup",
    address: "85 Newbury St",
  },
  {
    shop_id: "626533184446",
    shop_name: "Kohi Coffee Company",
    address: "92 Guest St",
  },
  {
    shop_id: "874644367263",
    shop_name: "Ogawa Coffee",
    address: "10 Milk Street",
  },
];

const userIDs = [
  "DXrZ76qj60eHuxhXPdTEMgEJSiz2",
  "JG3ZOiWZQSON6rF8Ocp8Zf5rjHg2",
];

const beverages = ["Latte", "Americano", "Pour Over", "Cortado"];
const milks = ["Black", "Oat", "Almond"];
const roasts = ["Light", "Medium", "Dark"];
const ratings = [1, 2, 3, 4, 5];

const generateRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const generateReviewText = () => {
  const templates = [
    "Staff was friendly, coffee was a bit burnt.",
    "Amazing place! Coffee tasted fantastic and the staff were very welcoming.",
    "Great ambiance but coffee could be better.",
    "Loved the latte art! The baristas are talented.",
    "The coffee is perfect here, but the seating is limited.",
  ];
  return generateRandomElement(templates);
};

const addDummyReviews = async () => {
  for (let i = 0; i < 100; i++) {
    const shop = generateRandomElement(shopData);
    const userID = generateRandomElement(userIDs);

    const review = {
      drinkRating: generateRandomElement(ratings),
      flavoring: Math.random() < 0.5,
      photo_urls: [],
      review: generateReviewText(),
      review_id: `${shop.shop_id}-${userID}-${i + 1}`,
      selectedBev: generateRandomElement(beverages),
      selectedMilk: generateRandomElement(milks),
      selectedProcess: "Washed",
      selectedRoast: generateRandomElement(roasts),
      selectedTemp: Math.random() < 0.5 ? "Hot" : "Cold",
      shopRating: generateRandomElement(ratings),
      shop_id: shop.shop_id,
      shop_name: shop.shop_name,
      staffRating: generateRandomElement(ratings),
      timestamp: new Date(),
      userID_submitting: userID,
      user_fav_drink: "Cold Brew",
      user_fav_milk: "Black",
      user_fav_process: "Dark",
      user_fav_roast: "Dark",
      user_fav_temp: "Hot",
      user_name_submitting: "Test User",
    };

    try {
      await setDoc(doc(db, "ShopReviews", review.review_id), review);
      console.log(`Added review: ${review.review_id}`);
    } catch (error) {
      console.error(`Error adding review ${review.review_id}:`, error);
    }
  }

  console.log("All reviews added successfully.");
};

const DummyData = () => {
  const handleGenerateReviews = async () => {
    try {
      await addDummyReviews();
      console.log("Dummy reviews added successfully!");
    } catch (error) {
      console.error("Error generating reviews:", error);
    }
  };

  return (
    <button onClick={handleGenerateReviews}>Generate Dummy Reviews</button>
  );
};

export default DummyData;
