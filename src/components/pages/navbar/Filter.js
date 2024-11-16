import React, { useState } from "react";
function Filter() {
  const [selectedRoast, setSelectedRoast] = useState("");

  const roastOptions = ["Light", "Medium", "Dark"];

  return (
    <div
      style={{
        position: "fixed",

        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h2>Filter by Roast</h2>
        <div>
          {roastOptions.map((roast) => (
            <label
              key={roast}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.25rem",
              }}
            >
              <input
                type="radio"
                value={roast}
                checked={selectedRoast === roast}
                onChange={() => setSelectedRoast(roast)}
                style={{ marginRight: "0.5rem" }}
              />
              {roast}
            </label>
          ))}
        </div>
      </div>

      {/* <div style={{ marginBottom: "1rem" }}>
        <h2>Filter by Drink</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "0.5rem",
          }}
        >
          {drinkOptions.map((drink) => (
            <label
              key={drink}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.25rem",
              }}
            >
              <input
                type="radio"
                value={drink}
                checked={selectedDrink === drink}
                onChange={() => setSelectedDrink(drink)}
                style={{ marginRight: "0.5rem" }}
              />
              {drink}
            </label>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default Filter;
