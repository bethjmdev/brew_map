import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const AddShop = () => {
  const [shopName, setShopName] = useState("");
  const [photos, setPhotos] = useState("");
  const [bio, setBio] = useState("");
  const [userIDSubmitting, setUserIDSubmitting] = useState("");
  const [userNameSubmitting, setUserNameSubmitting] = useState("");
  const [address, setAddress] = useState("");
  const [roastsOwnBeans, setRoastsOwnBeans] = useState(false);
  const [hours, setHours] = useState("");
  const [website, setWebsite] = useState("");
  const [typesOfBeverages, setTypesOfBeverages] = useState([]);
  const [typicalFlavorNotes, setTypicalFlavorNotes] = useState([]);
  const [typicalRoastStyle, setTypicalRoastStyle] = useState("");
  const [popularBev, setPopularBev] = useState("");
  const [has, setHas] = useState([]);
  const [doesNotHave, setDoesNotHave] = useState([]);
  const [beansAvailable, setBeansAvailable] = useState([]);

  const beverageOptions = [
    "Cold Brew",
    "Latte",
    "Macchiatto",
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

  const featureOptions = [
    "bakery food",
    "meal food",
    "gluten friendly",
    "dairy free options",
  ];

  const roastOptions = ["light", "medium", "dark"];

  // Function to generate a 12-digit random ID
  const generateShopId = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const handleCheckboxChange = (setter, value) => {
    setter((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a random 12-digit shop ID
    const shopId = generateShopId();

    try {
      await setDoc(doc(db, "CoffeeShops", shopId), {
        shop_name: shopName,
        shop_id: shopId,
        photos,
        bio,
        userID_submitting: userIDSubmitting,
        user_name_submitting: userNameSubmitting,
        address,
        roasts_own_beans: roastsOwnBeans,
        hours,
        website,
        types_of_beverages: typesOfBeverages,
        typical_flavor_notes: typicalFlavorNotes,
        typical_roast_style: typicalRoastStyle,
        popular_bev: popularBev,
        has,
        does_not_have: doesNotHave,
        beans_available: beansAvailable,
      });

      // Clear the form
      setShopName("");
      setPhotos("");
      setBio("");
      setUserIDSubmitting("");
      setUserNameSubmitting("");
      setAddress("");
      setRoastsOwnBeans(false);
      setHours("");
      setWebsite("");
      setTypesOfBeverages([]);
      setTypicalFlavorNotes([]);
      setTypicalRoastStyle("");
      setPopularBev("");
      setHas([]);
      setDoesNotHave([]);
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Photos URL"
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="text"
          placeholder="User ID Submitting"
          value={userIDSubmitting}
          onChange={(e) => setUserIDSubmitting(e.target.value)}
        />
        <input
          type="text"
          placeholder="User Name Submitting"
          value={userNameSubmitting}
          onChange={(e) => setUserNameSubmitting(e.target.value)}
        />
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

        <input
          type="text"
          placeholder="Typical Flavor Notes"
          value={typicalFlavorNotes}
          onChange={(e) => setTypicalFlavorNotes(e.target.value.split(","))}
        />

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

        <input
          type="text"
          placeholder="Popular Beverage"
          value={popularBev}
          onChange={(e) => setPopularBev(e.target.value)}
        />

        <label>Has:</label>
        {featureOptions.map((feature) => (
          <label key={feature}>
            <input
              type="checkbox"
              checked={has.includes(feature)}
              onChange={() => handleCheckboxChange(setHas, feature)}
            />
            {feature}
          </label>
        ))}

        <label>Does Not Have:</label>
        {featureOptions.map((feature) => (
          <label key={feature}>
            <input
              type="checkbox"
              checked={doesNotHave.includes(feature)}
              onChange={() => handleCheckboxChange(setDoesNotHave, feature)}
            />
            {feature}
          </label>
        ))}

        <input
          type="text"
          placeholder="Beans Available"
          value={beansAvailable}
          onChange={(e) => setBeansAvailable(e.target.value.split(","))}
        />

        <button type="submit">Add Shop</button>
      </form>
    </div>
  );
};

export default AddShop;
