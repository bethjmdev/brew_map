// import React, { useEffect, useState, useRef } from "react";
// import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";

// const Map = ({ searchQuery, coordinates, showCoffeeShow }) => {
//   const [zoom, setZoom] = useState(15);
//   const mapRef = useRef(null);
//   const [center, setCenter] = useState({ lat: 42.3779725, lng: -71.1073006 });

//   const mapContainerStyle = { width: "100%", height: "100vh" };

//   const mapOptions = {
//     styles: [
//       {
//         featureType: "poi",
//         elementType: "labels",
//         stylers: [{ visibility: "off" }],
//       },
//     ],
//     mapTypeControl: false,
//     zoomControl: true,
//     disableDefaultUI: true,
//   };

//   // Update map center based on search query
//   useEffect(() => {
//     if (searchQuery) {
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address: searchQuery }, (results, status) => {
//         if (status === "OK" && results[0]) {
//           const { lat, lng } = results[0].geometry.location;
//           setCenter({ lat: lat(), lng: lng() });
//           setZoom(15);
//         } else {
//           alert("City not found.");
//         }
//       });
//     }
//   }, [searchQuery]);

//   const truncateName = (shop_name) => {
//     return shop_name && shop_name.length > 19
//       ? shop_name.substring(0, 19) + "..."
//       : shop_name;
//   };

//   return (
//     <GoogleMap
//       mapContainerStyle={mapContainerStyle}
//       center={center}
//       zoom={zoom}
//       options={mapOptions}
//       onLoad={(map) => (mapRef.current = map)}
//       onZoomChanged={() => {
//         if (mapRef.current) {
//           const currentZoom = mapRef.current.getZoom();
//           setZoom(currentZoom);
//         }
//       }}
//     >
//       {coordinates.map((pin) => (
//         <React.Fragment key={pin.id}>
//           <Marker position={{ lat: pin.latitude, lng: pin.longitude }} />
//           {(zoom < 1 || zoom > 13) && (
//             <OverlayView
//               position={{ lat: pin.latitude, lng: pin.longitude }}
//               mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
//             >
//               <div
//                 style={{
//                   background: "white",
//                   width: "8rem",
//                   height: "3rem",
//                   borderRadius: "8px",
//                   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
//                   transform: "translate(20px, -50px)",
//                 }}
//                 onClick={() => showCoffeeShow(pin.id)}
//               >
//                 <p
//                   style={{
//                     textAlign: "left",
//                     lineHeight: "1rem",
//                     marginLeft: ".5rem",
//                     paddingTop: ".5rem",
//                     fontWeight: "bold",
//                     fontSize: ".7rem",
//                   }}
//                 >
//                   {pin.shop_name ? truncateName(pin.shop_name) : ""}
//                 </p>
//                 <p
//                   style={{
//                     textAlign: "left",
//                     lineHeight: ".3rem",
//                     marginLeft: ".5rem",
//                   }}
//                 >
//                   {pin.roast_style}
//                 </p>
//               </div>
//             </OverlayView>
//           )}
//         </React.Fragment>
//       ))}
//     </GoogleMap>
//   );
// };

// export default Map;

import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";

const Map = ({ searchQuery, coordinates, showCoffeeShow }) => {
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 42.3779725, lng: -71.1073006 });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
  });

  const mapContainerStyle = { width: "100%", height: "100vh" };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    mapTypeControl: false,
    zoomControl: true,
    disableDefaultUI: true,
  };

  // Update map center based on search query
  useEffect(() => {
    if (isLoaded && searchQuery) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setCenter({ lat: lat(), lng: lng() });
          setZoom(15);
        } else {
          alert("City not found.");
        }
      });
    }
  }, [searchQuery, isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;
  if (loadError) return <div>Error loading maps</div>;

  const truncateName = (shop_name) => {
    return shop_name && shop_name.length > 19
      ? shop_name.substring(0, 19) + "..."
      : shop_name;
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={mapOptions}
      onLoad={(map) => (mapRef.current = map)}
      onZoomChanged={() => {
        if (mapRef.current) {
          const currentZoom = mapRef.current.getZoom();
          setZoom(currentZoom);
        }
      }}
    >
      {coordinates.map((pin) => (
        <React.Fragment key={pin.id}>
          <Marker position={{ lat: pin.latitude, lng: pin.longitude }} />
          {(zoom < 1 || zoom > 13) && (
            <OverlayView
              position={{ lat: pin.latitude, lng: pin.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                style={{
                  background: "white",
                  width: "8rem",
                  height: "3rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                  transform: "translate(20px, -50px)",
                }}
                onClick={() => showCoffeeShow(pin.id)}
              >
                <p
                  style={{
                    textAlign: "left",
                    lineHeight: "1rem",
                    marginLeft: ".5rem",
                    paddingTop: ".5rem",
                    fontWeight: "bold",
                    fontSize: ".7rem",
                  }}
                >
                  {pin.shop_name ? truncateName(pin.shop_name) : ""}
                </p>
                <p
                  style={{
                    textAlign: "left",
                    lineHeight: ".3rem",
                    marginLeft: ".5rem",
                  }}
                >
                  {pin.roast_style}
                </p>
              </div>
            </OverlayView>
          )}
        </React.Fragment>
      ))}
    </GoogleMap>
  );
};

export default Map;
