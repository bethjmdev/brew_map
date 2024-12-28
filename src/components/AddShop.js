import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
  collection,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { db, auth } from "../utils/auth/firebase";
import stringSimilarity from "string-similarity";

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
  const [profileData, setProfileData] = useState("");
  const [alerted, setAlerted] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const bannedShops = [
    `Starbucks`,
    `Dunkin Donuts`,
    `Dunkin`,
    `Mcdonalds`,
    `Tim Hortons`,
    `Aroma Joe’s`,
    `321 Coffee`,
    `Au Bon pain`,
    `Biggby Coffee`,
    `Bluestone Lane`,
    `Cafe Trieste`,
    `Caribou Coffee`,
    `Coffee Beanery`,
    `The Coffee Bean & Tea Leaf`,
    `Dutch Bros. Coffee`,
    `Dutch Bros`,
    `Intelligentsia Coffee & Tea`,
    `Intelligentsia`,
    `Krispy Kreme`,
    `Kaladi Brothers Coffee`,
    `La Colombe`,
    `Peet’s Coffee`,
    `Verve Coffee`,
    `PJ’s Coffee`,
    `Pret a Manger`,
    `Scooters Coffee`,
    `Tully’s Coffee`,
    `Woods Coffee`,
    `Burger King`,
    `Wendy’s`,
    `Panera`,
    `Sonic`,
    `Scooters Coffee`,
    `Sonic Drive-in`,
    `Jack in the box`,
    `7 Brew`,
    `Cumberland Farms`,
  ];

  const bannedShopAbbreviations = [
    `stbx`,
    `strbx`,
    `dunkin`,
    `macas`,
    `mickey d’s`,
    `sbux`,
    `krispy`,
    `kaladi`,
    `Starbucks`,
    `Starbucks Coffee`,
    `Sbux`,
    `Starbux`,
    `The ‘Bucks`,
    `Dunkin Donuts`,
    `Dunkin'`,
    `DD`,
    `Dunkin’ Coffee`,
    `McDonald's`,
    `McD's`,
    `Mickey D's`,
    `McDee's`,
    `MacDonald's`,
    `Tim Hortons`,
    `Timmies`,
    `Timmy's`,
    `T-Ho’s`,
    `Aroma Joe's`,
    `AJ’s`,
    `Aroma Joes`,
    `321 Coffee`,
    `321 Café`,
    `Coffee 321`,
    `Au Bon Pain`,
    `ABP`,
    `Oh Bon Pain`,
    `Au Bon Café`,
    `Biggby Coffee`,
    `Big B Coffee`,
    `Bigby`,
    `Big B`,
    `Bluestone Lane`,
    `Bluestone Café`,
    `Bluestone Coffee`,
    `Cafe Trieste`,
    `Caffè Trieste`,
    `Café Trieste`,
    `Trieste Coffee`,
    `Caribou Coffee`,
    `Caribou`,
    `The ‘Bou`,
    `Caribou Café`,
    `Coffee Beanery`,
    `Beanery Coffee`,
    `Coffee Beanery Shop`,
    `The Coffee Bean & Tea Leaf`,
    `Coffee Bean`,
    `The Bean`,
    `Coffee Bean Tea Leaf`,
    `Dutch Bros Coffee`,
    `Dutch Bros`,
    `Dutch Brothers`,
    `Dutch`,
    `Intelligentsia Coffee & Tea`,
    `Intelligentsia`,
    `Intelli Coffee`,
    `Intelligentsia Tea`,
    `Krispy Kreme`,
    `KK`,
    `Krispy`,
    `Krispy Creme`,
    `Kaladi Brothers Coffee`,
    `Kaladi Coffee`,
    `Kaladi Bros`,
    `La Colombe`,
    `La Colombe Coffee`,
    `Colombe Café`,
    `Peet’s Coffee`,
    `Peet’s`,
    `Peets Café`,
    `Peet’s Coffee and Tea`,
    `Verve Coffee`,
    `Verve`,
    `Verve Café`,
    `PJ’s Coffee`,
    `PJ's`,
    `PJ’s Café`,
    `Pret a Manger`,
    `Pret`,
    `Pret a Café`,
    `Scooter’s Coffee`,
    `Scooters`,
    `Scooter’s`,
    `Scooter’s Café`,
    `Tully’s Coffee`,
    `Tully's`,
    `Tully's Café`,
    `Woods Coffee`,
    `Woods Café`,
    `Wood Coffee`,
    `Burger King`,
    `BK`,
    `The King`,
    `Burger King Café`,
    `Wendy’s`,
    `Wendy’s Café`,
    `Wendy’s Burgers`,
    `Panera`,
    `Panera Bread`,
    `Panera Café`,
    `Panera Coffee`,
    `Sonic`,
    `Sonic Drive-In`,
    `Sonic Burgers`,
    `Sonic Café`,
    `Jack in the Box`,
    `Jack’s`,
    `Jack`,
    `JITB`,
    `7 Brew`,
    `Seven Brew`,
    `7Brews`,
    `Cumberland Farms`,
    `Cumby’s`,
    `Cumbies`,
    `Cumberland Coffee`,
    `Cumberland Farms Café`,
  ];

  // Set initial values for default drink options
  const [typesOfBeverages, setTypesOfBeverages] = useState([
    "Latte",
    "Macchiato",
    "Drip coffee",
    "Pour over",
    "Cortado",
    "Espresso",
    "Americano",
  ]);

  const [
    typicalFlavorNotes,
    // setTypicalFlavorNotes
  ] = useState([]);
  const [typicalRoastStyle, setTypicalRoastStyle] = useState("");
  const [popularBev] = useState("");
  const [beansAvailable] = useState([]);
  const [dairyFreeOptions, setDairyFreeOptions] = useState(false);
  const [glutenFriendly, setGlutenFriendly] = useState(false);
  const [mealOptions, setMealOptions] = useState(false);
  const [bakeryOptions, setBakeryOptions] = useState(false);
  const [about, setAbout] = useState("");

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

  // State abbreviation validation with automatic capitalization
  const handleStateChange = (e) => {
    const input = e.target.value.toUpperCase();
    if (input.length > 2) {
      toast.error("Please enter a valid 2-letter state abbreviation.");
    } else {
      setState(input);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(
            doc(db, "BrewUsers", auth.currentUser.uid)
          );
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  console.log(profileData);

  // Function to get coordinates using Google Geocoding API
  const getCoordinates = async (address) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API; // Securely use an environment variable
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    // Log the URL for debugging
    console.log("Geocode URL:", geocodeUrl);

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      // Log the full response for debugging
      console.log("Geocode API response:", data);

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error(`Failed to get coordinates: ${data.status}`);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to get coordinates.");
      return null;
    }
  };

  const checkBannedShop = () => {
    const trimmedShopName = shopName.trim().toLowerCase();

    // Check direct matches
    const exactMatch = bannedShops.some(
      (bannedShop) => bannedShop.toLowerCase() === trimmedShopName
    );

    // Check abbreviations
    const abbreviationMatch = bannedShopAbbreviations.some(
      (abbr) => abbr.toLowerCase() === trimmedShopName
    );

    // Check for similarity
    const matches = bannedShops.map((bannedShop) =>
      stringSimilarity.compareTwoStrings(
        bannedShop.toLowerCase(),
        trimmedShopName
      )
    );

    const highestSimilarity = Math.max(...matches);

    if (exactMatch || abbreviationMatch || highestSimilarity > 0.6) {
      setIsBanned(true);
      if (!alerted) {
        alert(
          "This is not a specialty coffee shop and cannot be added to the map."
        );
        setAlerted(true);
      }
      return true;
    }

    setIsBanned(false);
    return false;
  };

  const handleShopNameBlur = () => {
    checkBannedShop();
  };

  const checkExistingShop = async (streetAddress, city, state) => {
    try {
      const shopQuery = query(
        collection(db, "CoffeeShops"),
        where("street_address", "==", streetAddress),
        where("city", "==", city),
        where("state", "==", state)
      );
      const querySnapshot = await getDocs(shopQuery);

      return !querySnapshot.empty; // Returns true if there's a match
    } catch (error) {
      console.error("Error checking existing shop:", error);
      return false;
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !shopName ||
  //     !streetAddress ||
  //     !city ||
  //     !state ||
  //     !hours ||
  //     !website ||
  //     !typesOfBeverages.length ||
  //     !typicalRoastStyle
  //   ) {
  //     toast.error("Please fill out all required fields.");
  //     return;
  //   }

  //   if (checkBannedShop()) {
  //     alert(
  //       "As previously mentioned, this shop cannot be added to the map. You are being rediected away from Add Shop."
  //     );
  //     navigate("/home");
  //     return;
  //   }

  //   const shopId = generateShopId();
  //   const currentUser = auth.currentUser;

  //   const address = `${streetAddress}, ${city}, ${state}`;
  //   const coordinates = await getCoordinates(address);

  //   if (!coordinates) return; // Exit if coordinates fetching failed

  //   if (!website) {
  //     toast.error("Website field is required.");
  //     return;
  //   }

  //   console.log("Writing to Firestore with website:", website);

  //   try {
  //     await setDoc(doc(db, "CoffeeShops", shopId), {
  //       shop_name: shopName,
  //       shop_id: shopId,
  //       userID_submitting: currentUser.uid,
  //       user_name_submitting:
  //         profileData.firstName + " " + profileData.firstName,
  //       street_address: streetAddress,
  //       city,
  //       state,
  //       roasts_own_beans: roastsOwnBeans,
  //       hours,
  //       website,
  //       types_of_beverages: typesOfBeverages,
  //       typical_flavor_notes: typicalFlavorNotes,
  //       roast_style: typicalRoastStyle,
  //       popular_bev: popularBev,
  //       dairy_free_options: dairyFreeOptions,
  //       gluten_friendly: glutenFriendly,
  //       meal_options: mealOptions,
  //       bakery_options: bakeryOptions,
  //       beans_available: beansAvailable,
  //       timestamp: serverTimestamp(),
  //     });

  //     // Save coordinates to Firestore in the Coordinates collection
  //     await setDoc(doc(db, "Coordinates", shopId), {
  //       shop_id: shopId,
  //       shop_name: shopName,
  //       street_address: address,
  //       roast_style: typicalRoastStyle,
  //       latitude: coordinates.latitude,
  //       longitude: coordinates.longitude,
  //     });

  //     await setDoc(doc(db, "CoffeeShopWebsites", shopId), {
  //       shop_id: shopId,
  //       website,
  //     });

  //     //this isnt quite right, but its getting to the right spot
  //     // await updateDoc(doc(db, "BrewBadges", currentUser.uid), {
  //     // cafes: increment(1),
  //     // });

  //     await updateDoc(doc(db, "BrewBadges", currentUser.uid), {
  //       cities: arrayUnion(...new Array(city)),
  //       cafes: increment(1),
  //     });

  //     toast.success("Shop added successfully!");
  //     navigate("/home");
  //   } catch (error) {
  //     console.error("Error adding shop:", error);
  //     toast.error("Failed to add shop.");
  //   }
  // };

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

    if (checkBannedShop()) {
      alert(
        "As previously mentioned, this shop cannot be added to the map. You are being redirected away from Add Shop."
      );
      navigate("/home");
      return;
    }

    const addressExists = await checkExistingShop(
      streetAddress,
      city.toUpperCase(),
      state.toUpperCase()
    );

    if (addressExists) {
      toast.error("This shop location is already in the system.");
      return;
    }

    const shopId = generateShopId();
    const currentUser = auth.currentUser;

    const address = `${streetAddress}, ${city}, ${state}`;
    const coordinates = await getCoordinates(address);

    if (!coordinates) return; // Exit if coordinates fetching failed

    try {
      await setDoc(doc(db, "CoffeeShops", shopId), {
        shop_name: shopName,
        shop_id: shopId,
        userID_submitting: currentUser.uid,
        user_name_submitting:
          profileData.firstName + " " + profileData.firstName,
        street_address: streetAddress,
        city,
        state,
        roasts_own_beans: roastsOwnBeans,
        hours,
        website,
        types_of_beverages: typesOfBeverages,
        typical_flavor_notes: typicalFlavorNotes,
        roast_style: typicalRoastStyle,
        popular_bev: popularBev,
        dairy_free_options: dairyFreeOptions,
        gluten_friendly: glutenFriendly,
        meal_options: mealOptions,
        bakery_options: bakeryOptions,
        beans_available: beansAvailable,
        timestamp: serverTimestamp(),
        about,
      });

      await setDoc(doc(db, "Coordinates", shopId), {
        shop_id: shopId,
        shop_name: shopName,
        street_address: address,
        roast_style: typicalRoastStyle,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      await setDoc(doc(db, "CoffeeShopWebsites", shopId), {
        shop_id: shopId,
        website,
      });

      await updateDoc(doc(db, "BrewBadges", currentUser.uid), {
        cities: arrayUnion(city),
        cafes: increment(1),
      });

      toast.success("Shop added successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error adding shop:", error);
      toast.error("Failed to add shop.");
    }
  };

  return (
    <div className="add-shop">
      <div className="add-shop-container">
        <h2>Add a New Coffee Shop</h2>
        <ToastContainer position="top-right" />
        <form onSubmit={handleSubmit} className="add-shop-form">
          <input
            type="text"
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            onBlur={handleShopNameBlur}
            required
            className="add-shop-input-text"
          />
          <input
            type="text"
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            required
            className="add-shop-input-text"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => setCity((prevCity) => prevCity.toUpperCase())}
            required
            className="add-shop-input-text"
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={handleStateChange}
            required
            className="add-shop-input-text"
          />
          <input
            type="text"
            placeholder="Small blurb about the coffee shop. Optional."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            className="add-shop-input-text"
          />
          <label className="y-n-box">
            Roasts Own Beans:
            <br />
            <br />
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
            className="add-shop-input-text"
          />
          <input
            type="text"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
            className="add-shop-input-text"
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
          <div className="roast-style">
            <label>Typical Roast Style:</label>
            <br />
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
          </div>
          <label className="y-n-box">
            Dairy Free Milks:
            <br />
            <br />
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
          <label className="y-n-box">
            Gluten Friendly:
            <br />
            <br />
            <button
              type="button"
              // className={glutenFriendly ? "active-button" : ""}
              className={`default-button ${
                glutenFriendly ? "active-button" : ""
              }`}
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
          <label className="y-n-box">
            Meal Options:
            <br />
            <br />
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
          <label className="y-n-box">
            Bakery Options:
            <br />
            <br />
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

          <SubmitButton
            text="Add Shop"
            type="submit"
            disabled={isBanned}
            // style={{ display: "flex", alignItems: "center" }}
          />
        </form>
      </div>
    </div>
  );
};

export default AddShop;
