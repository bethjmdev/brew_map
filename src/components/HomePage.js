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
  const [coffeeShop, setCoffeeShop] = useState(null); // state to hold shop details
  const [shopReviews, setShopReviews] = useState(null);

  //fetches long, lat, shop id's and name from coordinates collection
  useEffect(() => {
    const fetchCoordinates = async () => {
      const querySnapshot = await getDocs(collection(db, "Coordinates"));
      const pins = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoordinates(pins);
    };
    fetchCoordinates();
  }, []);

  //manages search bar
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

  const getShopDetails = async (id) => {
    const querySnapshot = await getDocs(collection(db, "CoffeeShops"));
    const shop = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .find((doc) => doc.id === id);
    setCoffeeShop(shop);
  };

  // const getCoffeeShopReviews = async (id) => {
  //   const querySnapshot = await getDocs(collection(db, "ShopReviews"));
  //   const reviews = querySnapshot.docs
  //     .map((doc) => ({ id: doc.id, ...doc.data() }))
  //     .find((doc) => doc.id === id);
  //   setShopReviews(reviews);
  // };

  const getCoffeeShopReviews = async (id) => {
    console.log("Fetching reviews for shop ID:", id); // Confirm the ID
    const querySnapshot = await getDocs(collection(db, "ShopReviews"));
    const reviews = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((doc) => doc.shop_id === id); // Adjust to match reviews by shop_id field
    console.log("Fetched reviews:", reviews); // Log fetched reviews
    setShopReviews(reviews);
  };

  //shows coffee show info when shop is clicked
  const showCoffeeShow = (id) => {
    setIsVisible(!isVisible);
    console.log("Shop ID:", id); // Log the shop ID here
    getShopDetails(id);
    getCoffeeShopReviews(id);
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
      {isVisible && (
        <ViewShop
          showCoffeeShow={showCoffeeShow}
          coffeeShop={coffeeShop}
          shopReviews={shopReviews}
        />
      )}
    </LoadScript>
  );
};

export default HomePage;
