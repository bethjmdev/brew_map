// import "./SignIn.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { React, useState } from "react";
import { toast } from "react-toastify";

import { auth, db } from "../utils/auth/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store the auth token in localStorage
      localStorage.setItem("authToken", user.accessToken);

      const userDocRef = doc(db, "BrewUsers", user.uid);
      await getDoc(userDocRef);

      navigate("/home"); // Navigate to /home on successful login
    } catch (err) {
      console.error("Error during login:", err.message || err);
      toast.error("Login error. Please check your credentials and try again.");
    }
  };

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
          <em>Create Account</em>
        </p>
      </div>
    </div>
  );
};

export default Login;
