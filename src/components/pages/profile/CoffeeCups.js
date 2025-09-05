import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

const CoffeeCups = ({ rating, maxCups = 5 }) => {
  // Ensure the rating is within a valid range (0 to maxCups)
  const filledCups = Math.min(Math.max(rating, 0), maxCups);

  // Generate an array representing the cups (filled or empty)
  const cups = Array.from({ length: maxCups }, (_, index) =>
    index < filledCups ? "filled" : "empty"
  );

  return (
    <div className="coffee-cups">
      {cups.map((cup, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faCoffee}
          style={{
            color: cup === "filled" ? "var(--primary)" : "var(--coffee-milk)",
            margin: "0 3px",
            fontSize: "1.2rem",
            transition: "all 0.2s ease",
            filter: cup === "filled" ? "drop-shadow(0 2px 4px rgba(128, 109, 91, 0.3))" : "none",
          }}
        />
      ))}
    </div>
  );
};

export default CoffeeCups;
