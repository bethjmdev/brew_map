import "./Login.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { React, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../utils/auth/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "../utils/auth/userStore";

import SubmitButton from "./button/SubmitButton";

const Login = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (currentUser) {
      alert("You are already logged in.");
      navigate("/home");
    }
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optionally store the token for manual use (but Firebase should persist this session)
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
        <h3>Log Into BrewMap</h3>
        <ToastContainer position="bottom-right" />

        <form
          onSubmit={handleLogin}
          // style={{
          //   display: "flex",
          //   // justifyContent: "center",
          //   alignItems: "center",
          //   flexDirection: "column",
          //   width: "50rem",
          // }}
          className="login-form"
        >
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
          </div>
          <SubmitButton text="Log In" type="submit" />
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
