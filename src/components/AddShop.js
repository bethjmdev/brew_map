import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/auth/firebase";
import SubmitButton from "./button/SubmitButton";
import "./AddShop.css";

const AddShop = ({ navigate }) => {
  const [shopName, setShopName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
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

    if (
      !shopName ||
      !streetAddress ||
      !city ||
      !state ||
      !hours ||
      !website ||
      !typesOfBeverages.length ||
      !typicalRoastStyle
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const shopId = generateShopId();
    const currentUser = auth.currentUser;

    try {
      await setDoc(doc(db, "CoffeeShops", shopId), {
        shop_name: shopName,
        shop_id: shopId,
        userID_submitting: currentUser.uid,
        user_name_submitting: currentUser.displayName || "Anonymous",
        street_address: streetAddress,
        city,
        state,
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

      setShopName("");
      setStreetAddress("");
      setCity("");
      setState("");
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
      alert("Shop added successfully!");

      navigate("/home");
    } catch (error) {
      console.error("Error adding shop:", error);
      alert("Failed to add shop.");
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
        <input
          type="text"
          placeholder="Street Address"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <label>
          Roasts Own Beans:
          <button
            type="button"
            className={roastsOwnBeans ? "active-button" : ""}
            onClick={() => setRoastsOwnBeans(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={!roastsOwnBeans ? "active-button" : ""}
            onClick={() => setRoastsOwnBeans(false)}
          >
            No
          </button>
        </label>
        <input
          type="text"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          required
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
          required
        >
          <option value="">Select Roast Style</option>
          {roastOptions.map((roast) => (
            <option key={roast} value={roast}>
              {roast}
            </option>
          ))}
        </select>
        <label>
          Dairy Free Milks:
          <button
            type="button"
            className={dairyFreeOptions ? "active-button" : ""}
            onClick={() => setDairyFreeOptions(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={!dairyFreeOptions ? "active-button" : ""}
            onClick={() => setDairyFreeOptions(false)}
          >
            No
          </button>
        </label>
        <label>
          Gluten Friendly:
          <button
            type="button"
            className={glutenFriendly ? "active-button" : ""}
            onClick={() => setGlutenFriendly(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={!glutenFriendly ? "active-button" : ""}
            onClick={() => setGlutenFriendly(false)}
          >
            No
          </button>
        </label>
        <label>
          Meal Options:
          <button
            type="button"
            className={mealOptions ? "active-button" : ""}
            onClick={() => setMealOptions(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={!mealOptions ? "active-button" : ""}
            onClick={() => setMealOptions(false)}
          >
            No
          </button>
        </label>
        <label>
          Bakery Options:
          <button
            type="button"
            className={bakeryOptions ? "active-button" : ""}
            onClick={() => setBakeryOptions(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={!bakeryOptions ? "active-button" : ""}
            onClick={() => setBakeryOptions(false)}
          >
            No
          </button>
        </label>
        <SubmitButton text="Add Shop" type="submit" />
      </form>
    </div>
  );
};

export default AddShop;
