import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../utils/auth/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpInfo from "../signup/SignUpInfo";
import "./EditProfile.css";
// import Info from "./Info";

const EditProfile = ({ navigate }) => {
  const [profileData, setProfileData] = useState({
    about: "",
    cafeDrink: "",
    cafeMilk: "",
    cafeTemp: "",
    email: "",
    favCafe: "",
    firstName: "",
    lastName: "",
    homeDrink: "",
    homeMilk: "",
    homeTemp: "",
    selectedRoast: "",
    yourCity: "",
  });

  const roastOptions = ["Light", "Medium", "Dark"];
  const drinkOptions = [
    "Cold Brew",
    "Latte",
    "Macchiatto",
    "French Press",
    "Aeropress",
    "Drip Coffee",
    "Pour Over",
    "Cortado",
    "Espresso",
    "Flat White",
    "Americano",
    "Other",
  ];
  const tempOptions = ["Hot", "Cold"];
  const milkOptions = [
    "Black",
    "Oat",
    "Almond",
    "Cow",
    "Cashew",
    "Coconut",
    "Flax",
  ];

  const selections = [
    {
      label: "Roast Preference",
      options: roastOptions,
      selectedValue: profileData.selectedRoast,
      onChange: (value) => handleSelectionChange("selectedRoast", value),
    },
    {
      label: "Cafe Drink",
      options: drinkOptions,
      selectedValue: profileData.cafeDrink,
      onChange: (value) => handleSelectionChange("cafeDrink", value),
    },
    {
      label: "Cafe Milk",
      options: milkOptions,
      selectedValue: profileData.cafeMilk,
      onChange: (value) => handleSelectionChange("cafeMilk", value),
    },
    {
      label: "Cafe Temperature",
      options: tempOptions,
      selectedValue: profileData.cafeTemp,
      onChange: (value) => handleSelectionChange("cafeTemp", value),
    },
    {
      label: "Home Drink",
      options: drinkOptions,
      selectedValue: profileData.homeDrink,
      onChange: (value) => handleSelectionChange("homeDrink", value),
    },
    {
      label: "Home Milk",
      options: milkOptions,
      selectedValue: profileData.homeMilk,
      onChange: (value) => handleSelectionChange("homeMilk", value),
    },
    {
      label: "Home Temperature",
      options: tempOptions,
      selectedValue: profileData.homeTemp,
      onChange: (value) => handleSelectionChange("homeTemp", value),
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "BrewUsers", user.uid));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectionChange = (name, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        const filteredData = Object.fromEntries(
          Object.entries(profileData).filter(([_, v]) => v !== "")
        );

        await updateDoc(doc(db, "BrewUsers", user.uid), filteredData);
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      }
    }
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <ToastContainer position="top-right" />
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <br />
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              readOnly
            />
          </label>
          <br />
          <label>
            Favorite Cafe:
            <input
              type="text"
              name="favCafe"
              value={profileData.favCafe}
              onChange={handleChange}
            />
          </label>
          <label>
            About:
            <input
              type="text"
              name="about"
              value={profileData.about}
              onChange={handleChange}
            />
          </label>
          <label>
            Your City:
            <input
              type="text"
              name="yourCity"
              value={profileData.yourCity}
              onChange={handleChange}
            />
          </label>

          {/* Pass profileData selections and handleSelectionChange callback */}
          <SignUpInfo
            selections={selections}
            profileData={profileData}
            onSelectionChange={handleSelectionChange}
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
