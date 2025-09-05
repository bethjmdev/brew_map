import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function ShopImages({ coffeeShop, openPhotoViewer }) {
  return (
    <div className="shop-images" style={{ width: "100%" }}>
      <div className="shop-images" style={{ width: "100%" }}>
        {coffeeShop.photos && coffeeShop.photos.length > 0 ? (
          coffeeShop.photos.slice(0, 3).map((photo, index) => {
            if (index === 0) {
              return (
                <a
                  key={index}
                  style={{
                    backgroundColor: "#806D5B",
                    backgroundImage: `url(${photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    textAlign: "right",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    padding: "1rem",
                    textDecoration: "none",
                    color: "white",
                  }}
                  id="photo1"
                  onClick={() => openPhotoViewer(coffeeShop.photos)} // Trigger photo viewer
                >
                  {/* More Photos */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      backgroundColor: "rgba(128, 109, 91, 0.8)",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(128, 109, 91, 0.9)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "rgba(128, 109, 91, 0.8)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faImage}
                      style={{
                        height: "1.2rem",
                        width: "1.2rem",
                      }}
                    />
                    <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                      More Photos
                    </span>
                  </div>
                </a>
              );
            }
          })
        ) : (
          // No images case
          <div
            className="shop-images"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "15rem",
              width: "100%",
              backgroundColor: "var(--coffee-milk)",
              borderRadius: "var(--border-radius-lg)",
              border: "2px solid var(--coffee-milk)",
              color: "var(--grey)",
              fontSize: "1rem",
              fontStyle: "italic",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            No photos to view. Upload a review to add a photo
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopImages;
