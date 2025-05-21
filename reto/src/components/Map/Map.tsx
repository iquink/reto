import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getUserLocation } from "./geolocation";
import styles from "./Map.module.css";

const Map: React.FC = () => {
  const position = getUserLocation();

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        className={styles.styledMapContainer}
        center={position}
        zoom={13}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default Map;
