import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utils/auth/firebase";

const Map = () => {
  const [coordinates, setCoordinates] = useState([]);
  const mapContainerStyle = { width: "100%", height: "100vh" };
  const center = { lat: 42.3779725, lng: -71.1073006 }; // Center on a default location if needed

  // Fetch data from Firestore
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

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        {coordinates.map((pin) => (
          <Marker
            key={pin.id}
            position={{ lat: pin.latitude, lng: pin.longitude }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
