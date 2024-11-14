import React, { useState } from "react";
function Filter() {
  const [selectedRoast, setSelectedRoast] = useState("");

  const roastOptions = ["Light", "Medium", "Dark"];

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        right: "3.5rem",
        backgroundColor: "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        width: "15rem",
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h2>Filter by Roast</h2>
        <div>
          {roastOptions.map((roast) => (
            <label
              key={roast}
              // style={{
              //   display: "flex",
              //   alignItems: "center",
              //   padding: "0.25rem",
              // }}
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
    </div>
  );
}

export default Filter;
