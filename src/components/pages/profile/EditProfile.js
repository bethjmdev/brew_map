import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../utils/auth/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        await updateDoc(doc(db, "BrewUsers", user.uid), profileData);
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      }
    }
  };

  return (
    <section>
      <h2>Edit Profile</h2>
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit}>
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
          Favorite Cafe Drink:
          <input
            type="text"
            name="cafeDrink"
            value={profileData.cafeDrink}
            onChange={handleChange}
          />
        </label>
        <label>
          Favorite Cafe Milk:
          <input
            type="text"
            name="cafeMilk"
            value={profileData.cafeMilk}
            onChange={handleChange}
          />
        </label>
        <label>
          Preferred Cafe Temperature:
          <input
            type="text"
            name="cafeTemp"
            value={profileData.cafeTemp}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            readOnly
          />
        </label>
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
          Home Drink:
          <input
            type="text"
            name="homeDrink"
            value={profileData.homeDrink}
            onChange={handleChange}
          />
        </label>
        <label>
          Home Milk:
          <input
            type="text"
            name="homeMilk"
            value={profileData.homeMilk}
            onChange={handleChange}
          />
        </label>
        <label>
          Preferred Home Temperature:
          <input
            type="text"
            name="homeTemp"
            value={profileData.homeTemp}
            onChange={handleChange}
          />
        </label>
        <label>
          Selected Roast:
          <input
            type="text"
            name="selectedRoast"
            value={profileData.selectedRoast}
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
        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
};

export default EditProfile;
