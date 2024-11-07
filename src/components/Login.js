// import "./SignIn.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { React, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { auth, db } from "../utils/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import necessary Firestore functions

// import { UserContext } from "../../../context/UserContext";

const Login = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { token, setToken } = useContext(UserContext);

  // let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDocRef = doc(db, "LenderUsers", user.uid); // Assuming user data is stored in "users" collection with UID as document ID
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.home_buyer !== false) {
          window.confirm(
            "Home buyers cannot log into this site. Please log in using the mobile app for Hombaez"
          );
          await signOut(auth);
          // console.log("Sign out initiated.");
          return;
        }
      }

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const expirationDate = new Date(userData.expirationDate);
        const today = new Date();

        if (expirationDate < today) {
          window.confirm(
            `${userData.firstName}, You are receiving this notification because your NMLS license has expired. After several attempts to notify you, we have locked your account. Please contact help@hombaez.com and one of our representatives can assist you.`
          );
          await signOut(auth);
          // console.log("Sign out initiated.");
          return;
        }
      }

      navigate("/");
    } catch (err) {
      console.error("Error during login:", err.response || err.message || err);
      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized: Invalid token.");
      } else {
        toast.error("Network error or internal server error.");
      }
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     console.log("logged out");
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  const forgotPassword = () => {
    navigate("/forgotpassword");
  };

  const needToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="auth_user">
      <div className="auth_user_container">
        <h3>Log In</h3>
        <ToastContainer position="bottom-right" />

        <form onSubmit={handleLogin}>
          <div className="signin_form">
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input_styling"
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input_styling"
            />
            <br />
            <button
              type="submit"
              style={{
                display: "flex",
                width: "8rem",
                color: "white",
                padding: "8px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderRadius: "4px",
                border: "3px solid var(--YELLOW, #FCC131)",
                background: "var(--Primary-1---Navy, #202B67)",
              }}
            >
              Log In
            </button>
          </div>
        </form>
        <p
          style={{
            color: "black",
            textDecoration: "underline",
            fontSize: "13px",
            lineHeight: "7px",
            cursor: "pointer",
          }}
          onClick={forgotPassword}
        >
          <em>Forgot Password?</em>
        </p>
        <p
          style={{
            color: "black",
            textDecoration: "underline",
            fontSize: "13px",
            lineHeight: "7px",
            cursor: "pointer",
          }}
          onClick={needToRegister}
        >
          <em>Creat Account</em>
        </p>
      </div>
    </div>
  );
};

export default Login;
