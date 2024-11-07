// Signup.js
import React, { useState } from "react";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating user...");
    //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //   const user = userCredential.user;
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
  
      console.log("User created:", user);
  
      // Update display name
      // await updateProfile(user, { displayName: name });
      // console.log("User profile updated with name:", name);
    
      // Save user data to Firestore with a random document ID
      console.log("Attempting to save user data to CoffeeShops collection...");
      console.log("Data to save:", { name, email, id: user.uid });
      console.log("Document reference:", doc(db, "CoffeeShops", user.uid));

      // await setDoc(doc(db, "CoffeeShops"), { name, email, id: user.uid });

      await addDoc(collection(db, "CoffeeShops"), { name, email, id: user.uid });

      console.log("User data saved to Firestore.");
      
      alert("Sign-up successful! User data saved to CoffeeShops.");
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
