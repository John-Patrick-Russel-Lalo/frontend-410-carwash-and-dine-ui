// /* eslint-disable no-unused-vars */
// import { useState, useEffect, useRef, useMemo } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// import { getCurrentUser } from "../Auth.js";

// // Fix marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Custom driver icon
// const driverIcon = new L.Icon({
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   className: "driver-marker",
// });

// const CustomerTrackingPage = ({ orderId }) => {
//   // Get current user from Auth
//   const currentUser = getCurrentUser();
//   if (!currentUser) throw new Error("Not authenticated");
//   if (currentUser.role !== "customer") throw new Error("Forbidden: Only customers can access this page");

//   const customerId = currentUser.id;
//   const wsRef = useRef(null);

//   // Function to fetch route from driver to customer
//   const fetchRoute = async (start, end) => {
//     if (!start || !end) return;

//     setLoadingRoute(true);
//     try {
//       // Using OpenRouteService (free tier available)
//       // You can replace with your preferred routing service
//       const response = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
//       );

//       if (!response.ok) throw new Error("Failed to fetch route");

//       const data = await response.json();

//       if (data.routes && data.routes.length > 0) {
//         const route = data.routes[0];

//         // Extract coordinates from GeoJSON
//         const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
//         setRouteCoordinates(coordinates);

//         // Calculate distance in km
//         const distanceKm = route.distance / 1000;
//         setDistance(distanceKm);

//         // Calculate ETA (assuming average speed of 40 km/h for city driving)
//         const durationMinutes = Math.round((route.duration / 60) * 1.2); // Add 20% buffer
//         setEta(durationMinutes);
//       }
//     } catch (error) {
//       console.error("Route fetch error:", error);
//     } finally {
//       setLoadingRoute(false);
//     }
//   };

//   const [myLocation, setMyLocation] = useState(null); // Customer GPS
//   const [driverLocation, setDriverLocation] = useState(null); // Driver from same order
//   const [routeCoordinates, setRouteCoordinates] = useState([]); // Route path coordinates
//   const [distance, setDistance] = useState(null); // Distance in km
//   const [eta, setEta] = useState(null); // ETA in minutes
//   const [loadingRoute, setLoadingRoute] = useState(false);

//   // -------------------------------------
//   // CONNECT TO WEBSOCKET
//   // -------------------------------------
//   useEffect(() => {
//     const wsURL = import.meta.env.VITE_SERVER_URL.replace("https", "ws") + "/tracker";

//     const ws = new WebSocket(wsURL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("🟢 Customer WS connected");

//       ws.send(
//         JSON.stringify({
//           type: "register",
//           userType: "customer",
//           userId: customerId,
//           orderId: orderId,
//         })
//       );
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "locationUpdate" && data.userType === "driver") {
//         setDriverLocation({
//           lat: data.lat,
//           lng: data.lng,
//           userId: data.userId,
//         });
//       }
//     };

//     ws.onclose = () => console.log("🔴 Customer WS disconnected");

//     return () => ws.close();
//   }, [customerId, orderId]);

//   // -------------------------------------
//   // SEND MY LIVE GPS (CUSTOMER)
//   // -------------------------------------
//   useEffect(() => {
//     let id = navigator.geolocation.watchPosition(
//       (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;

//         setMyLocation({ lat, lng });

//         if (wsRef.current?.readyState === WebSocket.OPEN) {
//           wsRef.current.send(
//             JSON.stringify({
//               type: "location",
//               lat,
//               lng,
//               userType: "customer",
//               userId: customerId,
//             })
//           );
//         }
//       },
//       (err) => console.error("GPS Error:", err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(id);
//   }, [customerId]);

//   // Fetch route when driver location changes
//   useEffect(() => {
//     if (driverLocation && myLocation) {
//       fetchRoute(driverLocation, myLocation);
//     }
//   }, [driverLocation, myLocation]);

//   // -------------------------------------
//   // ROUTE LINE (Connecting Customer ↔ Driver)
//   // -------------------------------------
//   const routePoints = useMemo(() => {
//     if (!myLocation || !driverLocation) return [];
//     return [
//       [myLocation.lat, myLocation.lng],
//       [driverLocation.lat, driverLocation.lng],
//     ];
//   }, [myLocation, driverLocation]);

//   // -------------------------------------
//   // FIRST GPS LOADING
//   // -------------------------------------
//   if (!myLocation) {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         📍 Requesting your GPS location…
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Track Your Driver</h1>
//           <p className="text-gray-600">Order #{orderId}</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* MAP */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[500px]">
//               <MapContainer
//                 center={[myLocation.lat, myLocation.lng]}
//                 zoom={15}
//                 className="h-full w-full"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                 {/* CUSTOMER MARKER */}
//                 <Marker position={[myLocation.lat, myLocation.lng]}>
//                   <Popup>📍 You (Customer)</Popup>
//                 </Marker>

//                 {/* DRIVER MARKER */}
//                 {driverLocation && (
//                   <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
//                     <Popup>🚗 Driver Location</Popup>
//                   </Marker>
//                 )}

//                 {/* ROUTE LINE (Full path from driver to customer) */}
//                 {routeCoordinates.length > 0 && (
//                   <Polyline
//                     positions={routeCoordinates}
//                     weight={5}
//                     color="#10B981"
//                     opacity={0.8}
//                     dashArray="0"
//                   />
//                 )}

//                 {/* SIMPLE LINE (if route not loaded yet) */}
//                 {routePoints.length > 1 && routeCoordinates.length === 0 && (
//                   <Polyline
//                     positions={routePoints}
//                     weight={4}
//                     color="#3B82F6"
//                     dashArray="8, 8"
//                   />
//                 )}
//               </MapContainer>
//             </div>
//           </div>

//           {/* INFO PANEL */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-6">📦 Delivery Status</h2>

//             <div className="space-y-4">
//               {/* Driver GPS and Status */}
//               {driverLocation ? (
//                 <div>
//                   <p className="font-semibold text-green-600">✅ Driver Location:</p>
//                   <p className="text-gray-700 text-sm">
//                     Lat: {driverLocation.lat.toFixed(6)} <br />
//                     Lng: {driverLocation.lng.toFixed(6)}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="text-yellow-600 font-medium">
//                   🚫 Waiting for driver location…
//                 </div>
//               )}

//               {/* Distance */}
//               {distance && (
//                 <div className="bg-blue-50 p-3 rounded-lg">
//                   <p className="font-semibold text-blue-900">📍 Distance:</p>
//                   <p className="text-blue-700 text-lg font-bold">{distance.toFixed(2)} km</p>
//                 </div>
//               )}

//               {/* ETA */}
//               {eta && (
//                 <div className="bg-green-50 p-3 rounded-lg">
//                   <p className="font-semibold text-green-900">⏱️ Estimated Time:</p>
//                   <p className="text-green-700 text-lg font-bold">
//                     {eta} minute{eta !== 1 ? "s" : ""}
//                   </p>
//                 </div>
//               )}

//               {/* Loading status */}
//               {loadingRoute && (
//                 <div className="text-gray-500 text-sm">
//                   🔄 Calculating route…
//                 </div>
//               )}

//               {/* Your Location */}
//               <div className="border-t pt-4">
//                 <p className="font-semibold">Your Location:</p>
//                 <p className="text-gray-700 text-sm">
//                   Lat: {myLocation.lat.toFixed(6)} <br />
//                   Lng: {myLocation.lng.toFixed(6)}
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerTrackingPage;

/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCurrentUser } from "../Auth.js";

import CustomerHeader from "../components/CustomerHeader.jsx";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CustomerTrackingMap = ({ orderId }) => {
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  const [locationMode, setLocationMode] = useState("gps"); // "gps" | "manual"
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // --------------------
  // WEBSOCKET (TRACK DRIVER)
  // --------------------
  useEffect(() => {
    console.log(orderId, currentUser);
    // if (!orderId || !currentUser) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_SERVER_URL.replace("https", "wss")}/tracker`
    );

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "register",
          userType: "customer",
          userId: currentUser.id,
        })
      );
      console.log("🟢 Customer WS connected");
      setLoading(false);
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "locationUpdate") {
          setDriverLocation({ lat: data.lat, lng: data.lng });
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = (err) => console.error("WS error:", err);
    ws.onclose = () => console.log("🔴 Customer WS disconnected");

    wsRef.current = ws;

    return () => ws.close();
  }, [orderId, currentUser]);

  useEffect(() => {
    if (locationMode !== "gps") return;

    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDeliveryLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsError(null);
      },
      (err) => {
        console.error("GPS error:", err);
        setGpsError("Failed to get GPS location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, [locationMode]);

  useEffect(() => {
  if (!deliveryLocation || !wsRef.current) return;

  if (wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({
        type: "deliveryLocation",
        lat: deliveryLocation.lat,
        lng: deliveryLocation.lng,
      })
    );

    console.log("📤 Sent delivery location to server:", deliveryLocation);
  }
}, [deliveryLocation]);


  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (locationMode === "manual") {
          setDeliveryLocation({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          });
        }
      },
    });
    return null;
  };

  // --------------------
  // ROLE GUARD
  // --------------------
  if (!currentUser || currentUser.role !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6"> Track Your Order</h1>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setLocationMode("gps")}
              className={`px-4 py-2 rounded-lg ${
                locationMode === "gps"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
            Use GPS
            </button>

            <button
              onClick={() => setLocationMode("manual")}
              className={`px-4 py-2 rounded-lg ${
                locationMode === "manual"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Pin on Map
            </button>
          </div>

          {/* <div className="bg-white rounded-xl shadow overflow-hidden h-[500px]">
            {driverLocation ? (
              <MapContainer
                center={[driverLocation.lat, driverLocation.lng]}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[driverLocation.lat, driverLocation.lng]}>
                  <Popup>🚗 Driver is here</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                🔄 Waiting for driver location…
              </div>
            )}
          </div> */}

          <div className="bg-white rounded-xl shadow overflow-hidden h-[500px]">
            {deliveryLocation ? (
              <MapContainer
                center={[deliveryLocation.lat, deliveryLocation.lng]}
                zoom={16}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {locationMode === "manual" && <MapClickHandler />}

                <Marker position={[deliveryLocation.lat, deliveryLocation.lng]}>
                  <Popup>
                    {locationMode === "gps"
                      ? " Your GPS location"
                      : " Pinned delivery location"}
                  </Popup>
                </Marker>

                {driverLocation && (
                  <Marker position={[driverLocation.lat, driverLocation.lng]}>
                    <Popup> Driver</Popup>
                  </Marker>
                )}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {gpsError ? ` ${gpsError}` : " Choose a delivery location"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerTrackingMap;
