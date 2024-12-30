import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, setDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../../../utils/auth/firebase"; // Firestore instance
import "./AddBeans.css";

function AddBeans({ navigate }) {
  const { identifier } = useParams(); // shop_id from URL

  const [beansList, setBeansList] = useState([
    { name: "", roast: "", notes: "", origin: "" },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch beans from Firestore when the component loads
  useEffect(() => {
    const fetchBeans = async () => {
      try {
        const coffeeBeansRef = doc(collection(db, "CoffeeBeans"), identifier);
        const docSnap = await getDoc(coffeeBeansRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBeansList(data.beans || []);
        }
      } catch (error) {
        console.error("Error fetching beans: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeans();
  }, [identifier]);

  const updateBean = (index, field, value) => {
    const updatedBeans = [...beansList];
    updatedBeans[index][field] = value;
    setBeansList(updatedBeans);
  };

  const addNewBean = () => {
    setBeansList([
      ...beansList,
      { name: "", roast: "", notes: "", origin: "" },
    ]);
  };

  const removeBean = (index) => {
    const updatedBeans = beansList.filter((_, i) => i !== index);
    setBeansList(updatedBeans);
  };

  const saveBeans = async () => {
    try {
      const coffeeBeansRef = doc(collection(db, "CoffeeBeans"), identifier);

      // Save the updated beans list to Firestore
      await setDoc(coffeeBeansRef, {
        shop_id: identifier,
        beans: beansList,
      });

      console.log("Beans saved successfully!");
      alert("Beans saved successfully!");
      navigate(`/home`); // Navigate back to the shop or any other page
    } catch (error) {
      console.error("Error saving beans: ", error);
      alert("Failed to save beans. Please try again.");
    }
  };

  const getRoastBackgroundColor = (roast) => {
    switch (roast) {
      case "Light":
        return "#B3A89D";
      case "Medium":
        return "#806D5B";
      case "Dark":
        return "#4F3E31";
      default:
        return "transparent"; // Default background color
    }
  };

  const getTextColor = (roast) => {
    return roast === "Dark" ? "#FFFFFF" : "#000000"; // White for dark roast, black for others
  };

  if (loading) {
    return (
      <div className="add-beans">
        <div className="add-beans-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="add-beans">
      <div className="add-beans-container">
        <h2>
          {beansList.length > 0 ? "Edit Beans or Add New Ones" : "Add Beans"}
        </h2>
        {beansList.map((bean, index) => (
          <div
            key={index}
            className="beans-entry"
            style={{
              backgroundColor: getRoastBackgroundColor(bean.roast),
              color: getTextColor(bean.roast), // Text color for the container
            }}
          >
            <label>
              Beans Name:
              <input
                type="text"
                value={bean.name}
                onChange={(e) => updateBean(index, "name", e.target.value)}
                className="add-beans-input"
                style={{
                  backgroundColor: "#FFFFFF", // Always white
                  color: "#000000", // Always black text
                }}
              />
            </label>
            <label>
              Beans Roast:
              <select
                value={bean.roast}
                onChange={(e) => updateBean(index, "roast", e.target.value)}
                className="add-beans-select"
                style={{
                  backgroundColor: "#FFFFFF", // Always white
                  color: "#000000", // Always black text
                }}
              >
                <option value="">Select Roast</option>
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
              </select>
            </label>
            <label>
              Beans Notes:
              <textarea
                value={bean.notes}
                onChange={(e) => updateBean(index, "notes", e.target.value)}
                placeholder="Enter notes about the beans"
                className="add-beans-textarea"
                style={{
                  backgroundColor: "#FFFFFF", // Always white
                  color: "#000000", // Always black text
                }}
              />
            </label>
            <label>
              Beans Origin:
              <input
                type="text"
                value={bean.origin}
                onChange={(e) => updateBean(index, "origin", e.target.value)}
                className="add-beans-input"
                style={{
                  backgroundColor: "#FFFFFF", // Always white
                  color: "#000000", // Always black text
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => removeBean(index)}
              className="remove-beans-button"
              style={{
                backgroundColor: "#f3709f", // Delete button color
                color: "#FFFFFF", // White text
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addNewBean}
          className="add-beans-button"
          style={{
            backgroundColor: "#42693E", // Add Beans button color
            color: "#FFFFFF", // White text
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 1.5rem",
            margin: "1rem 0",
            cursor: "pointer",
          }}
        >
          Add More Beans
        </button>
        <button
          type="button"
          onClick={saveBeans}
          className="save-beans-button"
          style={{
            backgroundColor: "#FFC700", // Save Beans button color
            color: "#000000", // Black text
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 1.5rem",
            margin: "1rem 0",
            cursor: "pointer",
          }}
        >
          Save Beans
        </button>
      </div>
    </div>
  );
}

export default AddBeans;
