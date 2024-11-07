// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const location = useLocation();

  const hideNavBar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

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
        <Route path="/login" element={<Login navigate={navigate} />} />
        <Route path="/register" element={<Signup navigate={navigate} />} />
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
