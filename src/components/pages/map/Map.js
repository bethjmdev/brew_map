import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";

const Map = ({ searchQuery, coordinates, showCoffeeShow }) => {
  const [zoom, setZoom] = useState(14);
  // const [zoom, setZoom] = useState(12);
  const mapRef = useRef(null);
  // const [center, setCenter] = useState({ lat: 42.3779725, lng: -71.1073006 });
  const [center, setCenter] = useState({ lat: 42.350688, lng: -71.072524 });

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
    return shop_name && shop_name.length > 15
      ? shop_name.substring(0, 15) + "..."
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
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  width: "10rem",
                  minHeight: "4rem",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(128, 109, 91, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)",
                  transform: "translate(20px, -50px)",
                  border: "2px solid #f0ebe5",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
                onClick={() => showCoffeeShow(pin.id)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translate(20px, -50px) scale(1.05)";
                  e.target.style.boxShadow = "0 12px 32px rgba(128, 109, 91, 0.4), 0 6px 16px rgba(0, 0, 0, 0.15)";
                  e.target.style.borderColor = "#806d5b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translate(20px, -50px) scale(1)";
                  e.target.style.boxShadow = "0 8px 24px rgba(128, 109, 91, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)";
                  e.target.style.borderColor = "#f0ebe5";
                }}
              >
                <p
                  style={{
                    textAlign: "left",
                    lineHeight: "1.2rem",
                    margin: "0 0 0.25rem 0",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    color: "#806d5b",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pin.shop_name ? truncateName(pin.shop_name) : ""}
                </p>
                <p
                  style={{
                    textAlign: "left",
                    lineHeight: "1rem",
                    margin: "0",
                    fontSize: "0.7rem",
                    color: "#6c757d",
                    fontStyle: "italic",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
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
