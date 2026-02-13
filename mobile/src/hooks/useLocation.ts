import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationState {
  latitude: number;
  longitude: number;
  address: string;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: 28.6139, // Default: Delhi
    longitude: 77.209,
    address: "Select Location",
    loading: true,
    error: null,
    hasPermission: false,
  });

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation((prev) => ({
          ...prev,
          loading: false,
          hasPermission: false,
          error: "Location permission denied",
        }));
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const address = geocode
        ? `${geocode.name || ""}, ${geocode.city || geocode.subregion || ""}`
        : "Current Location";

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address.replace(/^, /, ""),
        loading: false,
        error: null,
        hasPermission: true,
      });
    } catch (error) {
      console.error("Location error:", error);
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to get location",
      }));
    }
  };

  return { ...location, requestLocation };
};
