import React from "react";

function ShopImages({ coffeeShop }) {
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
                  }}
                  id="photo1"
                >
                  {/* image */}
                </a>
              );
            }
            return (
              <div className="shop-images-column" key="column">
                {index === 1 && (
                  <a
                    key={index}
                    style={{
                      backgroundColor: "#B3A89D",
                      backgroundImage: `url(${photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    id="photo2"
                  >
                    {/* image1 */}
                  </a>
                )}
                {index === 2 && (
                  <a
                    key={index}
                    style={{
                      backgroundColor: "#4F3E31",
                      backgroundImage: `url(${photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    id="photo3"
                  >
                    {/* image2 */}
                  </a>
                )}
              </div>
            );
          })
        ) : (
          // No images case
          <div
            className="shop-images"
            style={{
              //   backgroundColor: "var(--latte-brown)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10rem",
              marginLeft: "1rem",
            }}
          >
            Be the first to upload a photo
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopImages;
