// src/components/Button/Button.js
import React from "react";
import PropTypes from "prop-types";
import colors from "../../utils/colors";

const SubmitButton = ({ text, type = "button" }) => (
  <button type={type} style={styles.button}>
    {text}
  </button>
);

const styles = {
  button: {
    marginLeft: "4rem",
    width: "12rem",
    height: "2.8rem",
    backgroundColor: colors.latte_brown,
    color: colors.white,
    fontSize: "1.3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    // boxShadow: `4px 4px 0px ${colors.espresso_brown}`,
    boxShadow: `-3.5px 4.5px 0px ${colors.espresso_brown}`, // Left and bottom shadow
  },
};

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default SubmitButton;
