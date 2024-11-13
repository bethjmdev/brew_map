import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  //   const handleSearchClick = () => {
  //     if (searchQuery.trim()) {
  //       onSearch(searchQuery);
  //     }
  //   };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        marginLeft: ".6rem",
        backgroundColor: "none",
        zIndex: "4",
        position: "absolute",
      }}
    >
      <input
        type="text"
        placeholder="Enter city name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          padding: "0.5rem",
          width: "200px",
          marginRight: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {/* <button onClick={handleSearchClick} style={{ padding: "0.5rem" }}> */}
      {/* Search
      </button> */}
    </div>
  );
};

export default SearchBar;
