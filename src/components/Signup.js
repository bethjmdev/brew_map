import React, { useState } from "react";
// import { UserContext } from "../../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const userContext = useContext(UserContext);
  // const { token, setToken } = userContext;

  // -----------------------------------------------------------------
  //handles Signuping new member with firebase
  // -----------------------------------------------------------------

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await setDoc(doc(db, "BrewUsers", user.uid), {
        email,
        id: user.uid,
        firstName,
        lastName,
        is_active: true,
      });

      // Sign out the user immediately after registration
      await signOut(auth);
      console.log("Sign out initiated.");

      // Delay to ensure sign out is processed
      setTimeout(() => {
        onAuthStateChanged(auth, (user) => {
          if (!user) {
            console.log("User successfully signed out.");
            // Redirect to login or another page if needed
          } else {
            console.log("User still signed in.");
          }
        });
      }, 1000); // 1-second delay

      toast.success("Account Created!");
    } catch (err) {
      console.error("Error during user registration:", err);
      toast.error(err.message);
    }
  };


  return (
    <div className="create_user" style={{ height: "30rem", color: "black" }}>
      <h3>Create an Account</h3>
      <ToastContainer position="top-right" />
      <form className="create_user" onSubmit={handleRegister}>
        <input
          type="text"
          name="firstName"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="input_styling"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="input_styling"
        />

    
        <div      style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "1.3rem",
          }}> 
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input_styling"
        />
        </div>
        <br />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input_styling"
        />
        <input
          type="password"
          name="verify_password"
          placeholder="Confirm password"
          value={confirmationPassword}
          onChange={(e) => setConfirmationPassword(e.target.value)}
          className="input_styling"
        />

        <br />
        <br />
        <button type="submit">Create User</button>
      </form>

    </div>
  );
};

export default Signup;
