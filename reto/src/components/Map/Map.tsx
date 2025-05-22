import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getUserLocation } from "./geolocation";
import styles from "./Map.module.css";
import { LatLngExpression } from "leaflet";

/**
 * Props for the Map component.
 * @property isGetCoordinatesByClick - If true, enables picking coordinates by clicking on the map.
 * @property setPickedLocation - Callback to receive the picked latitude and longitude when the map is clicked.
 */


interface MapProps {
  isGetCoordinatesByClick?: boolean;
  setPickedLocation?: (lat: number, lng: number) => void;
  markers?:  { [name: string]: [LatLngExpression, L.Icon] }
}

/**
 * Map component renders a Leaflet map centered on the user's location.
 * If isGetCoordinatesByClick is true, clicking the map will call setPickedLocation with the clicked coordinates.
 *
 * @param isGetCoordinatesByClick - Enables coordinate picking on map click.
 * @param setPickedLocation - Callback for picked coordinates.
 * @returns The Map component.
 */
export const Map: React.FC<MapProps> = ({
  isGetCoordinatesByClick = false,
  setPickedLocation,
  markers = {},
}) => {
  const position = getUserLocation();

  /**
   * Handles map click events and calls setPickedLocation with the latitude and longitude.
   * Only rendered if isGetCoordinatesByClick is true.
   */
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (setPickedLocation) {
          setPickedLocation(e.latlng.lat, e.latlng.lng);
        }
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
      {Object.keys(markers).map((key, i) => (
        <Marker key={key} position={markers[key][0]} icon={markers[key][1]}>
          <Popup>{key}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
