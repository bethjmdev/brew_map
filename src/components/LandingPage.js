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

  const viewMap = () => {
    navigate("/home");
  };

  const goToAddShop = () => {
    navigate("/addshop");
  };

  const goToAddReview = () => {
    navigate("/addreview");
  };

  return (
    <div className="landingpage-container">
      <h3>Welcome to BrewMap</h3>
      <p id="header-p">
        Find new coffee shops easily, leave reviews, interact with friends
      </p>

      <div className="icon-container">
        <div className="icon-wrapper" onClick={navToLogin}>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <p>Sign in/up</p>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faMap} className="icon" onClick={viewMap} />
          <p>View Map</p>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={faShop}
            className="icon"
            onClick={goToAddShop}
          />
          <p>Add a Shop</p>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={faMugHot}
            className="icon"
            onClick={goToAddReview}
          />
          <p>Add a review</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
