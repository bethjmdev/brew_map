// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const hideNavBar =
    location.pathname === "/login" || location.pathname === "/newaccount";

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={<PrivateRoute component={<HomePage />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/newaccount" element={<Signup />} />
      </Routes>
    </div>
  );
}

// Mock authentication check (replace with actual authentication logic)
const isAuthenticated = () => {
  // Example: check for a token or authentication state here
  return Boolean(localStorage.getItem("authToken"));
};

// PrivateRoute component
function PrivateRoute({ component }) {
  return isAuthenticated() ? component : <Navigate to="/login" />;
}

export default App;
