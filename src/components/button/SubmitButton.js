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
    width: "12rem",
    height: "2.8rem",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
    color: "var(--white)",
    fontSize: "var(--font-size-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--primary)",
    borderRadius: "var(--border-radius-full)",
    cursor: "pointer",
    boxShadow: "var(--shadow-button)",
    fontWeight: "500",
    transition: "all var(--transition-normal)",
  },
};

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default SubmitButton;
