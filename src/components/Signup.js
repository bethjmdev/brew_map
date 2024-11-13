import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/auth/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import SignUpInfo from "../components/pages/signup/SignUpInfo";

const Signup = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedRoast, setSelectedRoast] = useState("");
  const [cafeDrink, setCafeDrink] = useState("");
  const [cafeMilk, setCafeMilk] = useState("");
  const [cafeTemp, setCafeTemp] = useState("");
  const [favCafe, setFavCafe] = useState("");
  const [homeDrink, setHomeDrink] = useState("");
  const [homeMilk, setHomeMilk] = useState("");
  const [homeTemp, setHomeTemp] = useState("");
  const [yourCity, setYourCity] = useState("");
  const [about, setAbout] = useState("");

  const roastOptions = ["Light", "Medium", "Dark"];
  const drinkOptions = [
    "Cold Brew",
    "Latte",
    "Macchiatto",
    "French Press",
    "Aeropress",
    "Drip Coffee",
    "Pour Over",
    "Cortado",
    "Espresso",
    "Flat White",
    "Americano",
    "Other",
  ];
  const tempOptions = ["Hot", "Cold"];
  const milkOptions = [
    "Black",
    "Oat",
    "Almond",
    "Cow",
    "Cashew",
    "Coconut",
    "Flax",
  ];

  const selections = [
    {
      label: "Roast Preference",
      options: roastOptions,
      selectedValue: selectedRoast,
      onChange: setSelectedRoast,
    },
    {
      label: "Cafe Drink",
      options: drinkOptions,
      selectedValue: cafeDrink,
      onChange: setCafeDrink,
    },
    {
      label: "Cafe Milk",
      options: milkOptions,
      selectedValue: cafeMilk,
      onChange: setCafeMilk,
    },
    {
      label: "Cafe Temperature",
      options: tempOptions,
      selectedValue: cafeTemp,
      onChange: setCafeTemp,
    },
    {
      label: "Home Drink",
      options: drinkOptions,
      selectedValue: homeDrink,
      onChange: setHomeDrink,
    },
    {
      label: "Home Milk",
      options: milkOptions,
      selectedValue: homeMilk,
      onChange: setHomeMilk,
    },
    {
      label: "Home Temperature",
      options: tempOptions,
      selectedValue: homeTemp,
      onChange: setHomeTemp,
    },
  ];

  const logIn = () => {
    navigate("/login");
  };

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
        selectedRoast,
        cafeDrink,
        cafeMilk,
        cafeTemp,
        favCafe,
        homeDrink,
        homeMilk,
        homeTemp,
        yourCity,
        about,
      });

      await signOut(auth);

      // Clear form fields
      setEmail("");
      setPassword("");
      setConfirmationPassword("");
      setFirstName("");
      setLastName("");
      setSelectedRoast("");
      setCafeDrink("");
      setCafeMilk("");
      setCafeTemp("");
      setFavCafe("");
      setHomeDrink("");
      setHomeMilk("");
      setHomeTemp("");
      setYourCity("");
      setAbout("");

      // Display success toast message
      toast.success("Account Created!");

      // Navigate to /login after a brief delay
      setTimeout(() => {
        navigate("/login");
      }, 500);
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "1.3rem",
          }}
        >
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

        {/* SignUpInfo for dynamic selections */}
        <SignUpInfo selections={selections} />

        <input
          type="text"
          name="favCafe"
          placeholder="Favorite Cafe"
          value={favCafe}
          onChange={(e) => setFavCafe(e.target.value)}
          className="input_styling"
        />
        <input
          type="text"
          name="yourCity"
          placeholder="Your City"
          value={yourCity}
          onChange={(e) => setYourCity(e.target.value)}
          className="input_styling"
        />
        <textarea
          name="about"
          placeholder="Tell us about yourself"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="input_styling"
          style={{ height: "5rem" }}
        />

        <button type="submit">Create User</button>
      </form>
      <br />
      <em onClick={logIn}>Already have an account?</em>
    </div>
  );
};

export default Signup;
