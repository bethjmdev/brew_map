import React from "react";

const SignUpOptions = ({ selections }) => (
  <div>
    {selections.map(({ label, options, selectedValue, onChange }, index) => (
      <div key={index} style={{ marginBottom: "1rem" }}>
        <h2>{label}</h2>
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
          {options.map((option) => (
            <label
              key={option}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.25rem",
              }}
            >
              <input
                type="radio"
                value={option}
                checked={selectedValue === option}
                onChange={() => onChange(option)}
                style={{ marginRight: "0.5rem" }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default SignUpOptions;
