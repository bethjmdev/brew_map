import React, { useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/auth/firebase";
import SearchBar from "./pages/map/SearchBar";
import ViewShop from "./pages/shop/ViewShop";
import Map from "./pages/map/Map";

const HomePage = () => {
  const [center, setCenter] = useState({ lat: 42.3779725, lng: -71.1073006 });
  const [zoom, setZoom] = useState(15);
  const [isVisible, setIsVisible] = useState(false);
  const [coordinates, setCoordinates] = useState([]); // state to hold coordinates

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

  const showCoffeeShow = () => {
    setIsVisible(!isVisible);
    console.log("showCoffeeShow running");
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
      <SearchBar onSearch={handleSearch} />
      <Map
        center={center}
        zoom={zoom}
        showCoffeeShow={showCoffeeShow}
        coordinates={coordinates}
      />
      {isVisible && <ViewShop showCoffeeShow={showCoffeeShow} />}
    </LoadScript>
  );
};

export default HomePage;
