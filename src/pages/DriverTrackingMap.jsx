import { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { getCurrentUser } from "../Auth.js";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom driver icon (blue)
const driverIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "driver-marker",
});

const DriverTrackingMap = ({ orderId }) => {
  // Get current user from Auth
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");
  if (currentUser.role !== "driver") throw new Error("Forbidden: Only drivers can access this page");

  const driverId = currentUser.id;
  const wsRef = useRef(null);

  // Function to fetch route from driver to customer
  const fetchRoute = async (start, end) => {
    if (!start || !end) return;
    
    setLoadingRoute(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) throw new Error("Failed to fetch route");
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Extract coordinates from GeoJSON
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoordinates(coordinates);
        
        // Calculate distance in km
        const distanceKm = route.distance / 1000;
        setDistance(distanceKm);
        
        // Calculate ETA
        const durationMinutes = Math.round(route.duration / 60);
        setEta(durationMinutes);
      }
    } catch (error) {
      console.error("Route fetch error:", error);
    } finally {
      setLoadingRoute(false);
    }
  };

  const [myLocation, setMyLocation] = useState(null); // Driver GPS
  const [customerLocation, setCustomerLocation] = useState(null); // Customer from same order
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Route path coordinates
  const [distance, setDistance] = useState(null); // Distance in km
  const [eta, setEta] = useState(null); // ETA in minutes
  const [loadingRoute, setLoadingRoute] = useState(false);

  // -------------------------------------
  // CONNECT TO WEBSOCKET
  // -------------------------------------
  useEffect(() => {
    const wsURL = import.meta.env.VITE_SERVER_URL.replace("https", "ws") + "/tracker";

    const ws = new WebSocket(wsURL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 Driver WS connected");

      ws.send(
        JSON.stringify({
          type: "register",
          userType: "driver",
          userId: driverId,
          orderId: orderId,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "locationUpdate" && data.userType === "customer") {
        setCustomerLocation({
          lat: data.lat,
          lng: data.lng,
          userId: data.userId,
        });
      }
    };

    ws.onclose = () => console.log("🔴 Driver WS disconnected");

    return () => ws.close();
  }, [driverId, orderId]);

  // -------------------------------------
  // SEND MY LIVE GPS (DRIVER)
  // -------------------------------------
  useEffect(() => {
    let id = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setMyLocation({ lat, lng });

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "location",
              lat,
              lng,
              userType: "driver",
              userId: driverId,
            })
          );
        }
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [driverId]);

  // Fetch route when customer location changes
  useEffect(() => {
    if (myLocation && customerLocation) {
      fetchRoute(myLocation, customerLocation);
    }
  }, [myLocation, customerLocation]);

  // -------------------------------------
  // ROUTE LINE (Connecting Driver ↔ Customer)
  // -------------------------------------
  const routePoints = useMemo(() => {
    if (!myLocation || !customerLocation) return [];
    return [
      [myLocation.lat, myLocation.lng],
      [customerLocation.lat, customerLocation.lng],
    ];
  }, [myLocation, customerLocation]);

  // -------------------------------------
  // FIRST GPS LOADING
  // -------------------------------------
  if (!myLocation) {
    return (
      <div className="p-6 text-center text-gray-600">
        📍 Requesting your GPS location…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Route</h1>
          <p className="text-gray-600">Order #{orderId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAP */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[500px]">
              <MapContainer
                center={[myLocation.lat, myLocation.lng]}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* DRIVER MARKER */}
                <Marker position={[myLocation.lat, myLocation.lng]} icon={driverIcon}>
                  <Popup>🚗 Your Location (Driver)</Popup>
                </Marker>

                {/* CUSTOMER MARKER */}
                {customerLocation && (
                  <Marker position={[customerLocation.lat, customerLocation.lng]}>
                    <Popup>📍 Customer Location</Popup>
                  </Marker>
                )}

                {/* ROUTE LINE (Full path from driver to customer) */}
                {routeCoordinates.length > 0 && (
                  <Polyline
                    positions={routeCoordinates}
                    weight={5}
                    color="#10B981"
                    opacity={0.8}
                    dashArray="0"
                  />
                )}

                {/* SIMPLE LINE (if route not loaded yet) */}
                {routePoints.length > 1 && routeCoordinates.length === 0 && (
                  <Polyline
                    positions={routePoints}
                    weight={4}
                    color="#3B82F6"
                    dashArray="8, 8"
                  />
                )}
              </MapContainer>
            </div>
          </div>

          {/* INFO PANEL */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">📦 Delivery Info</h2>

            <div className="space-y-4">
              {/* Customer Location */}
              {customerLocation ? (
                <div>
                  <p className="font-semibold text-green-600">✅ Customer Location:</p>
                  <p className="text-gray-700 text-sm">
                    Lat: {customerLocation.lat.toFixed(6)} <br />
                    Lng: {customerLocation.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="text-yellow-600 font-medium">
                  🚫 Waiting for customer location…
                </div>
              )}

              {/* Distance */}
              {distance && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-900">📍 Distance:</p>
                  <p className="text-blue-700 text-lg font-bold">{distance.toFixed(2)} km</p>
                </div>
              )}

              {/* ETA */}
              {eta && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-900">⏱️ Estimated Time:</p>
                  <p className="text-green-700 text-lg font-bold">
                    {eta} minute{eta !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              {/* Loading status */}
              {loadingRoute && (
                <div className="text-gray-500 text-sm">
                  🔄 Calculating route…
                </div>
              )}

              {/* Your Location */}
              <div className="border-t pt-4">
                <p className="font-semibold">Your Location:</p>
                <p className="text-gray-700 text-sm">
                  Lat: {myLocation.lat.toFixed(6)} <br />
                  Lng: {myLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DriverTrackingMap;
