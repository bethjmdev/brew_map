//use the same drop down but have it by state then city then shop
//if a shop is opened in the map for view then pull the info from there instead of doing the drop down
// grab the shop id, shop name, current user id, current user name, cirrent use fav drink
// allow user to add all review info
// upload to shopreviews

import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../utils/auth/firebase";
import { getAuth } from "firebase/auth";
import "./AddReview.css";

function AddReview({ navigate }) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [allShops, setAllShops] = useState([]);

  //will save this to the review, not collected form user input
  const [selectedShop, setSelectedShop] = useState({
    shop_name: "",
    shop_id: "",
    userID_submitting: "",
    user_name_submitting: "",
    firstName: "",
    lastName: "",
    cafeDrink: "",
  });

  //info for review to colelct form user
  const [selectedBev, setSelectedBev] = useState("");
  const [selectedMilk, setSelectedMilk] = useState("");
  const [selectedTemp, setSelectedTemp] = useState("");
  const [selectedRoast, setSelectedRoast] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [flavoring, setFlavoring] = useState(""); //have this be a bool
  const [drinkRating, setDrinkRating] = useState("");
  const [shopRating, setShopRating] = useState("");
  const [staffRating, setStaffRating] = useState("");
  const [review, setReview] = useState("");

  const beverageOptions = [
    "Cold Brew",
    "Latte",
    "Macchiato",
    "French press",
    "Areopress",
    "Drip coffee",
    "Pour over",
    "Cortado",
    "Espresso",
    "Flat White",
    "Americano",
    "Other",
  ];

  const milkOptions = [
    "Black",
    "Oat",
    "Almond",
    "Cow",
    "Coconut",
    "Flax",
    "Other",
  ];

  const ratingOptions = [
    `0: A total disaster, wouldnt wish it on my worst enemy`,
    `1: Pretty bad, left feeling disappointed and let down `,
    `2: Meh, not the worst, but I wouldnt go out of my way for it`,
    `3: It got the job done. Would go back if there wasnt other options available`,
    `4: Solid, enjoyed it, will go back`,
    `5: Fantastic, going here every chance I get and cant wait to tell everyone I know!`,
  ];

  // Get current user data from Firebase Auth
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Set the current user data and fetch additional BrewUsers data when the component mounts
  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "BrewUsers", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSelectedShop((prevData) => ({
              ...prevData,
              userID_submitting: currentUser.uid,
              user_name_submitting:
                `${userData.firstName} ${userData.lastName}` || "",
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              cafeDrink: userData.cafeDrink || "",
            }));
          } else {
            console.log("No user document found for the current user.");
          }
        } catch (error) {
          console.error("Error fetching BrewUser data:", error);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  // Fetch all shops once on component mount
  useEffect(() => {
    const fetchAllShops = async () => {
      const shopsRef = collection(db, "CoffeeShops");
      const querySnapshot = await getDocs(shopsRef);

      const allShopsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllShops(allShopsData);
    };

    fetchAllShops();
  }, []);

  // Populate unique states based on all shops data
  useEffect(() => {
    const uniqueStates = [
      ...new Set(allShops.map((shop) => shop.state)),
    ].sort();
    setStates(uniqueStates);
  }, [allShops]);

  // Filter cities based on selected state
  useEffect(() => {
    if (state) {
      const filteredCities = [
        ...new Set(
          allShops
            .filter((shop) => shop.state === state)
            .map((shop) => shop.city)
        ),
      ].sort();
      setCities(filteredCities);
    } else {
      setCities([]);
      setCity("");
      setShops([]);
    }
  }, [state, allShops]);

  // Filter shops based on selected state and city
  useEffect(() => {
    if (state && city) {
      const filteredShops = allShops
        .filter((shop) => shop.state === state && shop.city === city)
        .sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      setShops(filteredShops);
    } else {
      setShops([]);
    }
  }, [state, city, allShops]);

  // Handle shop selection and save necessary data
  const selectShop = (shopId) => {
    setShopId(shopId);
    const selected = allShops.find((shop) => shop.id === shopId);

    if (selected) {
      setSelectedShop((prevData) => ({
        ...prevData,
        shop_name: selected.shop_name || "",
        shop_id: shopId,
      }));
    }
  };

  // const handleCheckboxChange = (setter, value) => {
  //   setter((prev) =>
  //     prev.includes(value)
  //       ? prev.filter((item) => item !== value)
  //       : [...prev, value]
  //   );
  // };

  // New function to handle submitting the review
  const submitReview = async () => {
    try {
      const shopReviewsRef = collection(db, "ShopReviews");

      // Fetch existing reviews for the shop to calculate the document ID
      const shopReviewQuerySnapshot = await getDocs(shopReviewsRef);
      const reviewCount = shopReviewQuerySnapshot.docs.filter(
        (doc) => doc.data().shop_id === selectedShop.shop_id
      ).length;

      // Create the custom document ID
      const documentId = `${selectedShop.shop_id}-${
        selectedShop.userID_submitting
      }-${reviewCount + 1}`;

      // Data to be saved
      const reviewData = {
        selectedBev,
        selectedMilk,
        selectedTemp,
        selectedRoast,
        selectedProcess,
        flavoring,
        drinkRating,
        shopRating,
        staffRating,
        review,
        shop_id: selectedShop.shop_id,
        userID_submitting: selectedShop.userID_submitting,
        shop_name: selectedShop.shop_name,
        user_name_submitting: selectedShop.user_name_submitting,
      };

      // Save the review to Firestore with the custom document ID
      await setDoc(doc(shopReviewsRef, documentId), reviewData);

      console.log("Review submitted successfully!");
      alert("review submited successfully");
      // Clear all fields
      setSelectedBev("");
      setSelectedMilk("");
      setSelectedTemp("");
      setSelectedRoast("");
      setSelectedProcess("");
      setFlavoring("");
      setDrinkRating("");
      setShopRating("");
      setStaffRating("");
      setReview("");
      setShopId(""); // Clear shop selection
      setSelectedShop({
        shop_name: "",
        shop_id: "",
        userID_submitting: "",
        user_name_submitting: "",
        firstName: "",
        lastName: "",
        cafeDrink: "",
      });
      navigate("/home");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <h2>Add Review</h2>
      <div className="filter-section">
        {!shopId ? (
          // Render dropdowns if no shop is selected
          <>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {state && (
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}

            {state && city && shops.length > 0 && (
              <select
                value={shopId}
                onChange={(e) => selectShop(e.target.value)}
                className="dropdown-style"
              >
                <option value="">Select Shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shop_name}: {shop.street_address}
                  </option>
                ))}
              </select>
            )}
          </>
        ) : (
          // Render review form if a shop is selected
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitReview();
            }}
          >
            <h3>Review for {selectedShop.shop_name}</h3>
            <h2 htmlFor="review">Your Review:</h2>

            <h3>Drink you had</h3>
            {beverageOptions.map((beverage) => (
              <label key={beverage}>
                <input
                  type="radio"
                  name="selectedBev"
                  value={beverage}
                  checked={selectedBev === beverage}
                  onChange={() => setSelectedBev(beverage)}
                />
                {beverage}
              </label>
            ))}

            <br />
            <br />
            <h3>Milk you had</h3>
            {milkOptions.map((milk) => (
              <label key={milk}>
                <input
                  type="radio"
                  value={milk}
                  checked={selectedMilk === milk}
                  onChange={() => setSelectedMilk(milk)}
                />
                {milk}
              </label>
            ))}
            <br />
            <br />
            <label>
              Did you add flavoring? (e.g., vanilla, pumpkin spice, lavender,
              etc.):
              <button
                type="button"
                className={flavoring === true ? "active-button" : ""}
                onClick={() => setFlavoring(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={flavoring === false ? "active-button" : ""}
                onClick={() => setFlavoring(false)}
              >
                No
              </button>
            </label>
            <br />
            <br />

            <label>
              Drink Temp
              <button
                type="button"
                className={selectedTemp === "Hot" ? "active-button" : ""}
                onClick={() => setSelectedTemp("Hot")}
              >
                Hot
              </button>
              <button
                type="button"
                className={selectedTemp === "Cold" ? "active-button" : ""}
                onClick={() => setSelectedTemp("Cold")}
              >
                Cold
              </button>
            </label>
            <br />
            <br />

            <label>
              Roast Type
              <button
                type="button"
                className={selectedRoast === "Light" ? "active-button" : ""}
                onClick={() => setSelectedRoast("Light")}
              >
                Light
              </button>
              <button
                type="button"
                className={selectedRoast === "Medium" ? "active-button" : ""}
                onClick={() => setSelectedRoast("Medium")}
              >
                Medium
              </button>
              <button
                type="button"
                className={selectedRoast === "Dark" ? "active-button" : ""}
                onClick={() => setSelectedRoast("Dark")}
              >
                Dark
              </button>
            </label>
            <br />
            <br />

            <label>
              Process
              <button
                type="button"
                className={selectedProcess === "Natural" ? "active-button" : ""}
                onClick={() => setSelectedProcess("Natural")}
              >
                Natural
              </button>
              <button
                type="button"
                className={selectedProcess === "Washed" ? "active-button" : ""}
                onClick={() => setSelectedProcess("Washed")}
              >
                Washed
              </button>
              <button
                type="button"
                className={
                  selectedProcess === "Fermented" ? "active-button" : ""
                }
                onClick={() => setSelectedProcess("Fermented")}
              >
                Fermented
              </button>
            </label>
            <br />
            <br />

            <br />
            <br />
            <h3>Rate the coffee</h3>
            {ratingOptions.map((drink, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="drink"
                  value={drink}
                  checked={drinkRating === drink}
                  onChange={() => setDrinkRating(drink)}
                />
                {drink}
              </label>
            ))}
            <br />
            <br />
            <h3>Rate the vibe of the shop</h3>

            {ratingOptions.map((vibe, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="vibe"
                  value={vibe}
                  checked={shopRating === vibe}
                  onChange={() => setShopRating(vibe)}
                />
                {vibe}
              </label>
            ))}
            <br />
            <br />
            <h3>Rate the Staff</h3>

            {ratingOptions.map((staff, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="staff"
                  value={staff}
                  checked={staffRating === staff}
                  onChange={() => setStaffRating(staff)}
                />
                {staff}
              </label>
            ))}
            <br />
            <br />
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
            />
            <br />
            <br />
            <button type="submit">Submit Review</button>
          </form>
        )}
      </div>
    </>
  );
}

export default AddReview;
