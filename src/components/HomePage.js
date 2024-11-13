import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import Map from "../components/pages/map/Map";
import SearchBar from "../components/pages/map/SearchBar";

const HomePage = () => {
  const [center, setCenter] = useState({ lat: 42.3779725, lng: -71.1073006 });
  const [zoom, setZoom] = useState(15);

  const handleSearch = (cityName) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: cityName }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
        setZoom(15);
      } else {
        alert("City not found.");
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
      <SearchBar onSearch={handleSearch} />
      <Map center={center} zoom={zoom} />
    </LoadScript>
  );
};

export default HomePage;
