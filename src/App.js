// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./utils/auth/userStore";

import Signup from "./components/Signup";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import AddReview from "./components/AddReview";
import AddShop from "./components/AddShop";
import EditProfile from "./components/pages/profile/EditProfile";
import EditShop from "./components/pages/shop/EditShop";

function App() {
  // Call the initAuthListener on app load
  // const { initAuthListener } = useUserStore();
  // useEffect(() => {
  //   initAuthListener(); // Start listening for auth state changes
  // }, [initAuthListener]);

  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const { initAuthListener } = useUserStore(); // Correctly accessing it from the store

  const navigate = useNavigate();
  const location = useLocation();

  const hideNavBar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  useEffect(() => {
    initAuthListener(); // Initialize Firebase auth listener when the app loads
  }, [initAuthListener]);

  return (
    <div style={{ marginTop: "-10px" }}>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage navigate={navigate} />} />
        <Route
          path="/home"
          element={
            <PrivateRoute component={<HomePage navigate={navigate} />} />
          }
        />
        <Route
          path="/profile"
          element={<PrivateRoute component={<Profile navigate={navigate} />} />}
        />
        <Route
          path="/editprofile"
          element={
            <PrivateRoute component={<EditProfile navigate={navigate} />} />
          }
        />
        <Route
          path="/addreview"
          element={
            <PrivateRoute component={<AddReview navigate={navigate} />} />
          }
        />
        <Route
          path="/addshop"
          element={<PrivateRoute component={<AddShop navigate={navigate} />} />}
        />
        <Route
          path="/editshop"
          element={
            <PrivateRoute component={<EditShop navigate={navigate} />} />
          }
        />
        <Route path="/login" element={<Login navigate={navigate} />} />
        <Route path="/register" element={<Signup navigate={navigate} />} />
      </Routes>
    </div>
  );
}

// // Mock authentication check (replace with actual authentication logic)
// const isAuthenticated = () => {
//   // Example: check for a token or authentication state here
//   return Boolean(localStorage.getItem("authToken"));
// };

// // PrivateRoute component
// function PrivateRoute({ component }) {
//   return isAuthenticated() ? component : <Navigate to="/login" />;
// }

// PrivateRoute component
// function PrivateRoute({ component }) {
//   const { currentUser } = useUserStore();
//   return currentUser ? component : <Navigate to="/login" />;
// }

function PrivateRoute({ component }) {
  const { currentUser, isLoading } = useUserStore();

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading spinner or message while loading
  }

  return currentUser ? component : <Navigate to="/login" />;
}

export default App;
