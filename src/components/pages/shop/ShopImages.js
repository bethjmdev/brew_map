import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function ShopImages({ coffeeShop, openPhotoViewer }) {
  return (
    <div className="shop-images">
      <div className="shop-images">
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
                  }}
                  id="photo1"
                  onClick={() => openPhotoViewer(coffeeShop.photos)} // Trigger photo viewer
                >
                  {/* More Photos */}
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{
                      height: "2rem",
                      width: "2rem",
                      paddingLeft: "1rem",
                      backgroundColor: "#806D5B",
                    }}
                  />
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
              height: "10rem",
              marginLeft: "1rem",
              // backgroundColor: "#806D5B",
            }}
          >
            No photo's to view. Upload a review to add a photo
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopImages;
