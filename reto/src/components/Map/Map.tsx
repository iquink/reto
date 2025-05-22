import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getUserLocation } from "./geolocation";
import styles from "./Map.module.css";

/**
 * Props for the Map component.
 * @property isGetCoordinatesByClick - If true, enables logging of coordinates on map click.
 */
interface MapProps {
  isGetCoordinatesByClick?: boolean;
}

/**
 * Renders a Leaflet map centered on the user's location.
 * Optionally enables logging of coordinates when the map is clicked.
 *
 * @param props - MapProps
 * @returns The Map component.
 */
export const Map: React.FC<MapProps> = ({
  isGetCoordinatesByClick = false,
}) => {
  const position = getUserLocation();

  /**
   * Handles map click events and logs the latitude and longitude to the console.
   * Only rendered if isGetCoordinatesByClick is true.
   */
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        // Log coordinates when the map is clicked
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      className={styles.mapContainer}
      center={position}
      zoom={13}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {isGetCoordinatesByClick && <MapEvents />}
    </MapContainer>
  );
};
