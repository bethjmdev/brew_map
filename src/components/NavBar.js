import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faUser, faMap } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NavBar() {
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  const handleUserClick = () => {
    setShowLogout(!showLogout);
  };

  const logOut = async () => {
    // signOut(auth);
    // localStorage.removeItem("authToken"); // Clear the auth token
    // navigate("/login"); // Redirect to the login page
    // alert("Logged out!");

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
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ fontSize: "3rem", color: "#806D5B" }}
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
                borderRadius: "0.25rem",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                marginRight: "0.5rem",
              }}
              onClick={logOut}
            >
              Logout
            </div>
          )}
        </div>

        <FontAwesomeIcon
          icon={faMap}
          style={{ fontSize: "3rem", color: "#806D5B" }}
        />
      </div>
    </>
  );
}

export default NavBar;
