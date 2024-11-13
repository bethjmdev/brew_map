import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utils/auth/firebase";

import SearchBar from "./SearchBar";

const Map = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [zoom, setZoom] = useState(15); // Initial zoom level
  const mapRef = useRef(null); // Reference to store the map instance
  // const [initialCenter] = useState({ lat: 42.3779725, lng: -71.1073006 }); // Set only once
  const [center, setCenter] = useState({ lat: 42.3779725, lng: -71.1073006 });

  const mapContainerStyle = { width: "100%", height: "100vh" };

  // Map options to hide points of interest (shops, restaurants, etc.)
  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    // zoomControl: true, // Enable zoom control buttons
    // disableDefaultUI: false, // Ensure all default UI is enabled
    mapTypeControl: false, // Disable map/satellite toggle
    zoomControl: true, // Enable zoom control buttons
    disableDefaultUI: true,
  };

  // Fetch data from Firestore
  useEffect(() => {
    const fetchCoordinates = async () => {
      const querySnapshot = await getDocs(collection(db, "Coordinates"));
      const pins = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoordinates(pins);
      console.log("Fetched Pins:", pins);
    };
    fetchCoordinates();
  }, []);

  const truncateName = (shop_name) => {
    if (!shop_name || shop_name.length === 0) {
      return "";
    }
    return shop_name.length > 19
      ? shop_name.substring(0, 19) + "..."
      : shop_name;
  };

  const handleSearch = (cityName) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: cityName }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
        setZoom(15); // Adjust zoom as needed for city view
      } else {
        alert("City not found.");
      }
    });
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}> */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        // center={initialCenter}
        zoom={zoom}
        options={mapOptions}
        onLoad={(map) => (mapRef.current = map)} // Set map instance to mapRef
        onZoomChanged={() => {
          if (mapRef.current) {
            // Check if mapRef.current is defined
            const currentZoom = mapRef.current.getZoom(); // Get current zoom level
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
      {/* </LoadScript> */}
    </>
  );
};

export default Map;
