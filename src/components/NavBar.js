
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faUser, faMap } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../utils/auth/firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Filter from "./pages/navbar/Filter";
import { useUserStore } from "../utils/auth/userStore";
import "./NavBar.css"; // Import CSS file

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/home";

  const [showLogout, setShowLogout] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const { setCurrentUser } = useUserStore();

  const handleUserClick = () => setShowLogout(!showLogout);
  const handleAddClick = () => setShowAdd(!showAdd);
  const handleFilterClick = () => setShowFilter(!showFilter);

  const handleAddShop = () => navigate("/addshop");
  const goToEditProfile = () => navigate("/editprofile");
  const goToEditShop = () => navigate("/editshop");
  const goToAddReview = () => navigate("/addreview");

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      navigate("/login");
      toast.success("Successfully logged out!");
    } catch (err) {
      console.error("Error during logout:", err.message || err);
      toast.error("Logout error. Please try again.");
    }
  };

  const goToProfile = () => navigate("/profile");
  const goToMap = () => navigate("/home");

  return (
    <div className="navbar-container">
      {showAdd && (
        <div className="dropdown-menu">
          <a onClick={handleAddShop}>Add Shop</a>
          <br />
          {isHome && (
            <>
              <br />
              <a onClick={goToEditShop}>Edit Shop</a>
              <br />
            </>
          )}
          <br />
          <a onClick={goToAddReview}>Add Review</a>
        </div>
      )}
      <FontAwesomeIcon
        icon={faCirclePlus}
        className="add-icon"
        onClick={handleAddClick}
      />
      <div onClick={handleUserClick} className="user-icon-container">
        <FontAwesomeIcon icon={faUser} className="user-icon" />
        {showLogout && (
          <div className="dropdown-menu">
            <a onClick={goToProfile}>Profile</a>
            <br />
            <br />
            <a onClick={goToEditProfile}>Edit Profile</a>
            <br />
            <br />
            <a onClick={logOut}>Logout</a>
          </div>
        )}
      </div>
      {[
        "/profile",
        "/editprofile",
        "/addshop",
        "/addreview",
        "/editshop",
      ].includes(location.pathname) && (
        <FontAwesomeIcon icon={faMap} className="map-icon" onClick={goToMap} />
      )}
    </div>
  );
}

export default NavBar;
