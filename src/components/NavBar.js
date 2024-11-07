import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faUser, faMap } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

function NavBar() {
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  const handleUserClick = () => {
    setShowLogout(!showLogout);
  };

  const logOut = () => {
    signOut(auth);
    alert("Logged out!");
    navigate("/");
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
