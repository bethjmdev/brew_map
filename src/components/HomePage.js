import React from "react";
import { LoadScript } from "@react-google-maps/api";
import Map from "../components/pages/map/Map";

const HomePage = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
      <Map />
    </LoadScript>
  );
};

export default HomePage;
