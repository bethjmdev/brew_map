import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../utils/auth/firebase";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "./AddReview.css";

function AddReview({ navigate }) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [allShops, setAllShops] = useState([]);

  //this is for firebase images
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const storage = getStorage();

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

  const ratingOptions = [1, 2, 3, 4, 5];

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
              cafeMilk: userData.cafeMilk || "",
              cafeTemp: userData.cafeTemp || "",
              selectedRoast: userData.selectedRoast || "",
              selectedProcess: userData.selectedRoast || "",
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

  const submitReview = async () => {
    try {
      // Upload images and get their URLs
      const urls = await uploadImages();
      if (urls.length === 0) {
        alert("No images were uploaded.");
        return;
      }

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

      // Include image URLs in the review data
      const reviewData = {
        review_id: documentId,
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
        user_fav_drink: selectedShop.cafeDrink,
        user_fav_temp: selectedShop.cafeTemp,
        user_fav_milk: selectedShop.cafeMilk,
        user_fav_roast: selectedShop.selectedRoast,
        user_fav_process: selectedShop.selectedProcess,
        photo_urls: urls, // Save image URLs here
      };

      // Save the review to Firestore with the custom document ID
      await setDoc(doc(shopReviewsRef, documentId), reviewData);

      console.log("Review submitted successfully!");
      alert("Review submitted successfully");

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
      setImages([]);
      setImageUrls([]);
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

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      alert("Please select images first.");
      return [];
    }

    setIsUploading(true);

    const uploadPromises = images.map((image) => {
      const storageRef = ref(storage, `reviews/${Date.now()}-${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Error uploading image:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });

    const urls = await Promise.all(uploadPromises)
      .then((urls) => {
        setIsUploading(false); // Set uploading state to false after completion
        return urls;
      })
      .catch((error) => {
        setIsUploading(false); // Reset uploading state on error
        console.error("Error uploading one or more images:", error);
        alert("Error uploading images.");
        return [];
      });

    return urls;
  };

  return (
    <div className="add-review">
      <div className="add-review-container">
        {!shopId ? (
          // Render dropdowns if no shop is selected
          <div className="select-drop-down">
            <h2>Add Review</h2>
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
          </div>
        ) : (
          // Render review form if a shop is selected
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitReview();
            }}
          >
            <h2 htmlFor="review">Review for {selectedShop.shop_name}</h2>

            <h3>Drink you had</h3>
            <div className="beverage-options">
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
            </div>
            <br />
            <br />
            <h3>Milk you had</h3>

            <div className="beverage-options">
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
            </div>
            <br />
            <br />
            <label>
              Did you add flavoring? (vanilla, pumpkin spice, lavender, etc.):{" "}
              <br />
              <br />
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
              <br />
              <br />
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
              <br />
              <br />
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
              <br />
              <br />
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

            <h3>Rate the coffee</h3>
            {ratingOptions.map((drink, index) => (
              <label key={index} className="shop-ratings">
                <input
                  type="radio"
                  name="drink"
                  value={drink}
                  checked={drinkRating === drink}
                  onChange={() => setDrinkRating(drink)}
                />
                {drink}{" "}
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
              className="personal-review"
            />
            <br />
            <br />
            <label>
              Upload Photos:
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e)}
              />
            </label>

            <br />
            <button type="submit" onClick={uploadImages}>
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddReview;
