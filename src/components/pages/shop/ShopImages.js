// import React from "react";

// function ShopImages({ coffeeShop }) {
//   return (
//     <div className="shop-images">
//       <div className="shop-images">
//         {coffeeShop.photos && coffeeShop.photos.length > 0 ? (
//           coffeeShop.photos.slice(0, 3).map((photo, index) => {
//             if (index === 0) {
//               return (
//                 <a
//                   key={index}
//                   style={{
//                     backgroundColor: "#806D5B",
//                     backgroundImage: `url(${photo})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                   }}
//                   id="photo1"
//                 >
//                   {/* image */}
//                 </a>
//               );
//             }
//             return (
//               <div className="shop-images-column" key="column">
//                 {index === 1 && (
//                   <a
//                     key={index}
//                     style={{
//                       backgroundColor: "#B3A89D",
//                       backgroundImage: `url(${photo})`,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                     id="photo2"
//                   >
//                     {/* image1 */}
//                   </a>
//                 )}
//                 {index === 2 && (
//                   <a
//                     key={index}
//                     style={{
//                       backgroundColor: "#4F3E31",
//                       backgroundImage: `url(${photo})`,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                     id="photo3"
//                   >
//                     {/* image2 */}
//                   </a>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           // No images case
//           <div
//             className="shop-images"
//             style={{
//               //   backgroundColor: "var(--latte-brown)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "10rem",
//               marginLeft: "1rem",
//             }}
//           >
//             Be the first to upload a photo
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ShopImages;

import React from "react";

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
                  }}
                  id="photo1"
                  onClick={() => openPhotoViewer(coffeeShop.photos)} // Trigger photo viewer
                >
                  {/* image */}
                </a>
              );
            }
            return (
              <div className="shop-images-column" key={`column-${index}`}>
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
                    onClick={() => openPhotoViewer(coffeeShop.photos)} // Trigger photo viewer
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
                    onClick={() => openPhotoViewer(coffeeShop.photos)} // Trigger photo viewer
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
