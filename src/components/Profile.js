import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/auth/firebase"; // Ensure correct Firebase imports

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);

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

  return (
    <section>
      <h2>Profile</h2>
      {profileData ? (
        <div>
          <p>
            <strong>About:</strong> {profileData.about}
          </p>
          <p>
            <strong>Favorite Cafe Drink:</strong> {profileData.cafeDrink}
          </p>
          <p>
            <strong>Favorite Cafe Milk:</strong> {profileData.cafeMilk}
          </p>
          <p>
            <strong>Preferred Cafe Temperature:</strong> {profileData.cafeTemp}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Favorite Cafe:</strong> {profileData.favCafe}
          </p>
          <p>
            <strong>First Name:</strong> {profileData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {profileData.lastName}
          </p>
          <p>
            <strong>Home Drink:</strong> {profileData.homeDrink}
          </p>
          <p>
            <strong>Home Milk:</strong> {profileData.homeMilk}
          </p>
          <p>
            <strong>Preferred Home Temperature:</strong> {profileData.homeTemp}
          </p>
          <p>
            <strong>Selected Roast:</strong> {profileData.selectedRoast}
          </p>
          <p>
            <strong>Your City:</strong> {profileData.yourCity}
          </p>
          <p>
            <strong>Active Status:</strong>{" "}
            {profileData.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </section>
  );
};

export default Profile;
