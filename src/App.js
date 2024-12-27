// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
import OtherUser from "./components/OtherUser";
import FollowerFeed from "./components/FollowerFeed";
// import DummyData from "./components/DummyData";

function App() {
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

  useEffect(() => {
    useUserStore.getState().initAuthListener();
  }, []);

  //   useEffect(() => {
  //   if (!currentUser) {
  //     alert("You need to log in.");
  //     navigate("/login");
  //   }
  // }, [currentUser]);

  // useEffect(() => {
  //   if (!currentUser && location.pathname !== "/login") {
  //     alert("You need to log in.");
  //     navigate("/login");
  //   }
  // }, [currentUser, location.pathname]);

  return (
    <div style={{ marginTop: "-10px" }}>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage navigate={navigate} />} />
        {/* <Route path="/dummy" element={<DummyData navigate={navigate} />} /> */}

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
        <Route
          path="/otheruser/:identifier"
          element={<PrivateRoute component={<OtherUser />} />}
        />
        <Route
          path="/feed"
          element={
            <PrivateRoute component={<FollowerFeed navigate={navigate} />} />
          }
        />
        <Route path="/login" element={<Login navigate={navigate} />} />
        <Route path="/register" element={<Signup navigate={navigate} />} />
      </Routes>
    </div>
  );
}

function PrivateRoute({ component }) {
  const { currentUser, isLoading } = useUserStore();

  if (isLoading) {
    return <div>Loading!!!!</div>; // Display a loading spinner or message while loading
  }

  return currentUser ? component : <Navigate to="/login" />;
}

export default App;
