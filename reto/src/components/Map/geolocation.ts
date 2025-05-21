import { LatLngExpression } from 'leaflet';

// Joensuu coordinates
const DEFAULT_GEOLOCATION: LatLngExpression = [
  62.603464754124815, 29.77454975232058
];

export const getUserLocation = (): LatLngExpression => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        return [latitude, longitude];
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
  return DEFAULT_GEOLOCATION;
};
