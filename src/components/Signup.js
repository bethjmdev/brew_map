// Signup.js
import React, { useState } from "react";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating user...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("User created:", user);
  
      // Update display name
      await updateProfile(user, { displayName: name });
      console.log("User profile updated with name:", name);
  
      // Log the user ID to verify it's correct before setting the document
      console.log("User ID:", user.uid); // Add this line
  
      // Save user data to Firestore
      console.log("Saving user data to BrewUsers collection...");
      await setDoc(doc(db, "BrewUsers", user.uid), {
        name: name,
        email: email,
        uid: user.uid,
        // createdAt: new Date(),
      });
      console.log("User data saved to Firestore.");
      
      alert("Sign-up successful! User data saved to BrewUsers.");
    } catch (error) {
      console.error("Error creating user or saving data:", error);
      alert("Sign-up failed: " + error.message);
    }
  };
  

  return (
    <form onSubmit={handleSignup}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
