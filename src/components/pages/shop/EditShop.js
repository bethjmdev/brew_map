import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../utils/auth/firebase";
import SubmitButton from "../../button/SubmitButton";
import "./EditShop.css";

const EditShop = ({ navigate }) => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);

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

  const [shopData, setShopData] = useState({
    shop_name: "",
    shop_id: "",
    userID_submitting: "",
    user_name_submitting: "",
    street_address: "",
    roasts_own_beans: "",
    hours: "",
    website: "",
    types_of_beverages: [],
    typical_flavor_notes: [],
    typical_roast_style: "",
    beans_available: [],
  });

  // Fetch unique states with coffee shops for the dropdown
  useEffect(() => {
    const fetchStates = async () => {
      const shopsRef = collection(db, "CoffeeShops");
      const querySnapshot = await getDocs(shopsRef);

      const uniqueStates = [
        ...new Set(querySnapshot.docs.map((doc) => doc.data().state)),
      ];

      setStates(uniqueStates);
    };

    fetchStates();
  }, []);

  // Fetch cities based on selected state
  useEffect(() => {
    const fetchCities = async () => {
      if (state) {
        const shopsRef = collection(db, "CoffeeShops");
        const q = query(shopsRef, where("state", "==", state));
        const querySnapshot = await getDocs(q);

        const uniqueCities = [
          ...new Set(querySnapshot.docs.map((doc) => doc.data().city)),
        ];

        setCities(uniqueCities);
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [state]);

  // Fetch shops based on selected state and city
  useEffect(() => {
    const fetchShops = async () => {
      if (state && city) {
        const shopsRef = collection(db, "CoffeeShops");
        const q = query(
          shopsRef,
          where("state", "==", state),
          where("city", "==", city)
        );
        const querySnapshot = await getDocs(q);

        const matchedShops = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setShops(matchedShops);
      } else {
        setShops([]);
      }
    };

    fetchShops();
  }, [state, city]);

  // Load selected shop data into form fields
  const selectShop = async (shopId) => {
    setShopId(shopId);
    try {
      const shopDoc = await getDoc(doc(db, "CoffeeShops", shopId));
      if (shopDoc.exists()) {
        const data = shopDoc.data();
        console.log("Shop data fetched:", data);
        setSelectedShop(data);
        setShopData({
          shop_name: data.shop_name || "",
          shop_id: data.shop_id || "",
          userID_submitting: data.userID_submitting || "",
          user_name_submitting: data.user_name_submitting || "",
          street_address: data.street_address || "",
          roasts_own_beans: data.roasts_own_beans,
          hours: data.hours || "",
          website: data.website || "",
          types_of_beverages: data.types_of_beverages || [],
          typical_flavor_notes: data.typical_flavor_notes || [],
          typical_roast_style: data.typical_roast_style || "",
          dairy_free_options: data.dairy_free_options,
          gluten_friendly: data.gluten_friendly,
          meal_options: data.meal_options,
          bakery_options: data.bakery_options,
          beans_available: data.beans_available || [],
        });
      } else {
        console.log("No shop document found");
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };

  const handleCheckboxChange = (field, value) => {
    setShopData((prevData) => {
      const updatedField = prevData[field]?.includes(value)
        ? prevData[field].filter((item) => item !== value)
        : [...(prevData[field] || []), value];
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShop) return;

    try {
      await updateDoc(doc(db, "CoffeeShops", shopId), shopData);
      alert("Shop updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating shop:", error);
      alert("Failed to update shop.");
    }
  };

  return (
    <div className="edit-shop">
      <div className="edit-shop-container">
        <h3>Edit Coffee Shop</h3>
        <ToastContainer position="top-right" />

        <div className="filter-section">
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

        {shopId && shopData && (
          <form onSubmit={handleSubmit} className="edit-shop-form">
            <input
              type="text"
              placeholder="Shop Name"
              value={shopData.shop_name}
              onChange={(e) =>
                setShopData({ ...shopData, shop_name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Street Address"
              value={shopData.street_address}
              onChange={(e) =>
                setShopData({ ...shopData, street_address: e.target.value })
              }
            />
            <label>
              Roasts Own Beans:
              <br />
              <br />
              <button
                type="button"
                className={shopData.roasts_own_beans ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, roasts_own_beans: true })
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={!shopData.roasts_own_beans ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, roasts_own_beans: false })
                }
              >
                No
              </button>
            </label>
            <input
              type="text"
              placeholder="Hours"
              value={shopData.hours}
              onChange={(e) =>
                setShopData({ ...shopData, hours: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Website"
              value={shopData.website}
              onChange={(e) =>
                setShopData({ ...shopData, website: e.target.value })
              }
            />

            <label>Types of Beverages:</label>
            <br />
            <div className="beverage-grid">
              {beverageOptions.map((beverage) => (
                <label key={beverage}>
                  <input
                    type="checkbox"
                    checked={
                      shopData.types_of_beverages?.includes(beverage) || false
                    }
                    onChange={() =>
                      handleCheckboxChange("types_of_beverages", beverage)
                    }
                  />
                  {beverage}
                </label>
              ))}
            </div>
            <label>Typical Roast Style:</label>
            <select
              value={shopData.typical_roast_style || ""}
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  typical_roast_style: e.target.value,
                })
              }
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
              <br />
              <br />
              <button
                type="button"
                className={shopData.dairy_free_options ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, dairy_free_options: true })
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={!shopData.dairy_free_options ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, dairy_free_options: false })
                }
              >
                No
              </button>
            </label>
            <label>
              Gluten Friendly:
              <br />
              <br />
              <button
                type="button"
                className={shopData.gluten_friendly ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, gluten_friendly: true })
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={!shopData.gluten_friendly ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, gluten_friendly: false })
                }
              >
                No
              </button>
            </label>
            <label>
              Meal Options:
              <br />
              <br />
              <button
                type="button"
                className={shopData.meal_options ? "active-button" : ""}
                onClick={() => setShopData({ ...shopData, meal_options: true })}
              >
                Yes
              </button>
              <button
                type="button"
                className={!shopData.meal_options ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, meal_options: false })
                }
              >
                No
              </button>
            </label>
            <label>
              Bakery Options:
              <br />
              <br />
              <button
                type="button"
                className={shopData.bakery_options ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, bakery_options: true })
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={!shopData.bakery_options ? "active-button" : ""}
                onClick={() =>
                  setShopData({ ...shopData, bakery_options: false })
                }
              >
                No
              </button>
            </label>
            <SubmitButton text="Save Changes" type="submit" />
          </form>
        )}
      </div>
    </div>
  );
};

export default EditShop;
