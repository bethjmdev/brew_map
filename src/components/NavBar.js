import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faUser,
  faMap,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Filter from "./pages/navbar/Filter";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/home";

  const [showLogout, setShowLogout] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleUserClick = () => {
    setShowLogout(!showLogout);
  };

  const handleAddClick = () => {
    setShowAdd(!showAdd);
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken"); // Clear the auth token
      navigate("/login"); // Redirect to the login page
      alert("Logged out!");
    } catch (err) {
      console.error("Error during logout:", err.message || err);
      toast.error("Logout error. Please try again.");
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToMap = () => {
    navigate("/home");
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          display: "flex",
          flexDirection: "column",
          zIndex: 4,
          height: "15rem",
          justifyContent: "space-between",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        {showAdd && (
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "3.5rem",
              backgroundColor: "white",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              marginRight: "1.5rem",
              width: "8rem",
            }}
          >
            <a>Add Shop</a>
            <br />
            {isHome && (
              <>
                <br />
                <a>Edit Shop</a>
                <br />
              </>
            )}
            <br />
            <a>Add Review</a>
          </div>
        )}
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ fontSize: "3rem", color: "#806D5B" }}
          onClick={handleAddClick}
        />
        <div onClick={handleUserClick} style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faUser}
            style={{
              fontSize: "3rem",
              color: "#806D5B",
            }}
          />

          {showLogout && (
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "3.5rem",
                backgroundColor: "white",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                marginRight: "0.5rem",
                width: "8rem",
              }}
            >
              <a onClick={goToProfile}>Profile</a>
              <br />
              <br />
              <a onClick={goToProfile}>Edit Profile</a>
              <br />
              <br />
              <a onClick={logOut}>Logout</a>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {location.pathname === "/home" && (
            <FontAwesomeIcon
              icon={faFilter}
              style={{ fontSize: "3rem", color: "#806D5B", cursor: "pointer" }}
              onClick={handleFilterClick}
            />
          )}
          {showFilter && (
            <div
              style={{
                position: "absolute",
                top: "100",
                right: "3.5rem",
                backgroundColor: "white",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                marginRight: "1.5rem",
                width: "25rem",
              }}
            >
              <Filter />
            </div>
          )}
        </div>

        {["/profile", "/addshop", "/addreview"].includes(location.pathname) && (
          <FontAwesomeIcon
            icon={faMap}
            style={{ fontSize: "3rem", color: "#806D5B" }}
            onClick={goToMap}
          />
        )}
      </div>
    </>
  );
}

export default NavBar;
