import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMap,
  faShop,
  faMugHot,
} from "@fortawesome/free-solid-svg-icons";
import "./LandingPage.css";

export const LandingPage = ({ navigate }) => {
  const navToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landingpage-container">
      <h3>Welcome to BrewMap</h3>

      <div className="icon-container">
        <div className="icon-wrapper" onClick={navToLogin}>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <p>Sign in/up</p>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faMap} className="icon" />
          <p>View Map</p>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faShop} className="icon" />
          <p>Add a Shop</p>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faMugHot} className="icon" />
          <p>Add a review</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
