import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/auth/firebase";
import { auth } from "../utils/auth/firebase"; // Import Firebase auth to access current user
import SubmitButton from "./button/SubmitButton";
import "./AddShop.css";

const AddShop = () => {
  const [shopName, setShopName] = useState("");
  // const [photos, setPhotos] = useState("");
  // const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [roastsOwnBeans, setRoastsOwnBeans] = useState(false);
  const [hours, setHours] = useState("");
  const [website, setWebsite] = useState("");
  const [typesOfBeverages, setTypesOfBeverages] = useState([]);
  const [typicalFlavorNotes, setTypicalFlavorNotes] = useState([]);
  const [typicalRoastStyle, setTypicalRoastStyle] = useState("");
  const [popularBev, setPopularBev] = useState("");
  const [beansAvailable, setBeansAvailable] = useState([]);
  const [dairyFreeOptions, setDairyFreeOptions] = useState(false);
  const [glutenFriendly, setGlutenFriendly] = useState(false);
  const [mealOptions, setMealOptions] = useState(false);
  const [bakeryOptions, setBakeryOptions] = useState(false);

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

  const roastOptions = ["light", "medium", "dark"];

  // Function to generate a 12-digit random ID
  const generateShopId = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shopId = generateShopId();

    // Get current user info
    const currentUser = auth.currentUser;

    try {
      await setDoc(doc(db, "CoffeeShops", shopId), {
        shop_name: shopName,
        shop_id: shopId,
        // photos,
        // bio,
        userID_submitting: currentUser.uid, // Set userIDSubmitting from current user
        user_name_submitting: currentUser.displayName || "Anonymous", // Set userNameSubmitting from current user
        address,
        roasts_own_beans: roastsOwnBeans,
        hours,
        website,
        types_of_beverages: typesOfBeverages,
        typical_flavor_notes: typicalFlavorNotes,
        typical_roast_style: typicalRoastStyle,
        popular_bev: popularBev,
        dairy_free_options: dairyFreeOptions,
        gluten_friendly: glutenFriendly,
        meal_options: mealOptions,
        bakery_options: bakeryOptions,
        beans_available: beansAvailable,
      });

      // Clear the form
      setShopName("");
      // setPhotos("");
      // setBio("");
      setAddress("");
      setRoastsOwnBeans(false);
      setHours("");
      setWebsite("");
      setTypesOfBeverages([]);
      setTypicalFlavorNotes([]);
      setTypicalRoastStyle("");
      setPopularBev("");
      setDairyFreeOptions(false);
      setGlutenFriendly(false);
      setMealOptions(false);
      setBakeryOptions(false);
      setBeansAvailable([]);

      toast.success("Shop added successfully!");
    } catch (error) {
      console.error("Error adding shop:", error);
      toast.error("Failed to add shop.");
    }
  };

  return (
    <div>
      <h3>Add a New Coffee Shop</h3>
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit} className="add-shop-form">
        <input
          type="text"
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
        />
        {/* <input
          type="text"
          placeholder="Photos URL"
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
        /> */}
        {/* <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        /> */}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label>
          Roasts Own Beans:
          <input
            type="checkbox"
            checked={roastsOwnBeans}
            onChange={() => setRoastsOwnBeans(!roastsOwnBeans)}
          />
        </label>
        <input
          type="text"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <label>Types of Beverages:</label>
        <div className="beverage-grid">
          {beverageOptions.map((beverage) => (
            <label key={beverage}>
              <input
                type="checkbox"
                checked={typesOfBeverages.includes(beverage)}
                onChange={() =>
                  handleCheckboxChange(setTypesOfBeverages, beverage)
                }
              />
              {beverage}
            </label>
          ))}
        </div>
        <label>Typical Roast Style:</label>
        <select
          value={typicalRoastStyle}
          onChange={(e) => setTypicalRoastStyle(e.target.value)}
        >
          <option value="">Select Roast Style</option>
          {roastOptions.map((roast) => (
            <option key={roast} value={roast}>
              {roast}
            </option>
          ))}
        </select>
        <label>
          Dairy Free Options:
          <input
            type="checkbox"
            checked={dairyFreeOptions}
            onChange={() => setDairyFreeOptions(!dairyFreeOptions)}
          />
        </label>
        <label>
          Gluten Friendly:
          <input
            type="checkbox"
            checked={glutenFriendly}
            onChange={() => setGlutenFriendly(!glutenFriendly)}
          />
        </label>
        <label>
          Meal Options:
          <input
            type="checkbox"
            checked={mealOptions}
            onChange={() => setMealOptions(!mealOptions)}
          />
        </label>
        <label>
          Bakery Options:
          <input
            type="checkbox"
            checked={bakeryOptions}
            onChange={() => setBakeryOptions(!bakeryOptions)}
          />
        </label>
        <SubmitButton text="Add Shop" type="submit" />
      </form>
    </div>
  );
};

export default AddShop;
