// /* eslint-disable no-unused-vars */
// import { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// import { apiCall, getCurrentUser } from "../Auth.js";

// // Fix Leaflet icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// const POLL_INTERVAL = 5000; // 🔥 5 seconds

// const DriverTrackingMap = () => {
//   // --------------------
//   // AUTH (MEMOIZED)
//   // --------------------
//   const currentUser = useMemo(() => getCurrentUser(), []);

//   const [orders, setOrders] = useState([]);
//   const [activeOrder, setActiveOrder] = useState(null);
//   const [myLocation, setMyLocation] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const watchIdRef = useRef(null);
//   const pollRef = useRef(null);

//   // --------------------
//   // FETCH ORDERS (SAFE)
//   // --------------------
//   const fetchOrders = useCallback(async () => {
//     if (!currentUser || currentUser.role !== "driver") return;

//     try {
//       const res = await apiCall(
//         `${import.meta.env.VITE_SERVER_URL}/kitchen/orders`,
//         { method: "GET" }
//       );

//       if (!res.ok) throw new Error("Failed to fetch orders");

//       const data = await res.json();

//       setOrders((prev) =>
//         JSON.stringify(prev) === JSON.stringify(data) ? prev : data
//       );

//       setActiveOrder((prev) => prev ?? data[0] ?? null);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser]);

//   // --------------------
//   // INITIAL FETCH + POLLING
//   // --------------------
//   useEffect(() => {
//     fetchOrders();

//     pollRef.current = setInterval(fetchOrders, POLL_INTERVAL);

//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, [fetchOrders]);

//   // --------------------
//   // GPS TRACKING (OPTIMIZED)
//   // --------------------
//   useEffect(() => {
//     if (!currentUser || currentUser.role !== "driver") return;

//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (pos) => {
//         const next = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };

//         setMyLocation((prev) =>
//           prev?.lat === next.lat && prev?.lng === next.lng ? prev : next
//         );
//       },
//       (err) => console.error("GPS Error:", err),
//       { enableHighAccuracy: true }
//     );

//     return () => {
//       if (watchIdRef.current) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//     };
//   }, [currentUser]);

//   // --------------------
//   // START DELIVERY
//   // --------------------
//   const startDelivery = useCallback(async (orderId) => {
//     try {
//       const res = await apiCall(
//         `${import.meta.env.VITE_SERVER_URL}/driver/orders/${orderId}/start`,
//         { method: "PUT" }
//       );

//       if (!res.ok) throw new Error("Failed to start delivery");

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === orderId ? { ...o, status: "delivering" } : o
//         )
//       );

//       setActiveOrder((prev) =>
//         prev?.id === orderId ? { ...prev, status: "delivering" } : prev
//       );
//     } catch (err) {
//       console.error("Start delivery error:", err);
//     }
//   }, []);

//   // --------------------
//   // ROLE GUARD
//   // --------------------
//   if (!currentUser || currentUser.role !== "driver") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">🚗 Driver Dashboard</h1>
//           <p className="text-gray-600">Welcome, {currentUser.name}</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* MAP */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden h-[450px]">
//             {myLocation ? (
//               <MapContainer
//                 center={[myLocation.lat, myLocation.lng]}
//                 zoom={15}
//                 className="h-full w-full"
//               >
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={[myLocation.lat, myLocation.lng]}>
//                   <Popup>🚗 You</Popup>
//                 </Marker>
//               </MapContainer>
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-500">
//                 📍 Waiting for GPS…
//               </div>
//             )}
//           </div>

//           {/* ORDERS */}
//           <div className="bg-white rounded-xl shadow p-4 space-y-4">
//             <h2 className="text-xl font-bold">📦 Assigned Orders</h2>

//             {orders.length === 0 ? (
//               <p className="text-gray-500 text-center py-6">
//                 No assigned orders
//               </p>
//             ) : (
//               orders.map((order) => (
//                 <div
//                   key={order.id}
//                   onClick={() => setActiveOrder(order)}
//                   className={`p-3 rounded-lg border cursor-pointer transition ${
//                     activeOrder?.id === order.id
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200 hover:border-blue-300"
//                   }`}
//                 >
//                   <p className="font-semibold">Order #{order.id}</p>
//                   <p className="text-sm text-gray-600">{order.name}</p>
//                   <p className="text-sm text-gray-500">
//                     Status:{" "}
//                     <span className="font-medium text-blue-600">
//                       {order.status}
//                     </span>
//                   </p>

//                   {order.status === "assigned" && (
//                     <button
//                       onClick={() => startDelivery(order.id)}
//                       className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
//                     >
//                       ▶ Start Delivery
//                     </button>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverTrackingMap;

/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import StaffHeader from "../components/StaffHeader.jsx";

import { apiCall, getCurrentUser } from "../Auth.js";


const DEFAULT_CENTER = { lat: 14.5995, lng: 120.9842 };



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

const POLL_INTERVAL = 5000;

const DriverTrackingMap = () => {
  // --------------------
  // AUTH
  // --------------------
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerLocation, setCustomerLocation] = useState(null);


  const watchIdRef = useRef(null);
  const pollRef = useRef(null);
  const wsRef = useRef(null); 

  // --------------------
  // FETCH ORDERS (5s POLL)
  // --------------------
  const fetchOrders = useCallback(async () => {
    if (!currentUser || currentUser.role !== "driver") return;

    try {
      const res = await apiCall(
        `${import.meta.env.VITE_SERVER_URL}/kitchen/orders`,
        { method: "GET" }
      );

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      setOrders((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data
      );

      setActiveOrder((prev) => prev ?? data[0] ?? null);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOrders();
    pollRef.current = setInterval(fetchOrders, POLL_INTERVAL);

    return () => clearInterval(pollRef.current);
  }, [fetchOrders]);

  // --------------------
  // WEBSOCKET (REGISTER DRIVER)
  // --------------------
  // useEffect(() => {
  //   if (!currentUser) return;

  //   const ws = new WebSocket(
  //     `${import.meta.env.VITE_SERVER_URL.replace("https", "wss")}/tracker`
  //   );

  //   ws.onopen = () => {
  //     ws.send(
  //       JSON.stringify({
  //         type: "register",
  //         userType: "driver",
  //         userId: currentUser.id,
  //       })
  //     );
  //     console.log("🟢 Driver WS connected");
  //   };

  //   ws.onerror = (err) => console.error("WS error:", err);
  //   ws.onclose = () => console.log("🔴 Driver WS disconnected");

  //   wsRef.current = ws;

  //   return () => ws.close();
  // }, [currentUser]);



  useEffect(() => {
  if (!currentUser) return;

  const ws = new WebSocket(
    `${import.meta.env.VITE_SERVER_URL.replace("https", "wss")}/tracker`
  );

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "register",
        userType: "driver",
        userId: currentUser.id,
      })
    );
    console.log("🟢 Driver WS connected");
  };

  ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  console.log("Driver WS message received:", data);

  if (
    data.type === "deliveryLocation"
    
  ) {
    setCustomerLocation({
      lat: data.lat,
      lng: data.lng,
    });
  }
};


  ws.onerror = console.error;
  ws.onclose = () => console.log("🔴 Driver WS disconnected");

  wsRef.current = ws;
  return () => ws.close();
}, [currentUser]);


  // --------------------
  // GPS TRACKING → WS
  // --------------------
useEffect(() => {
  if (!navigator.geolocation) return;

  watchIdRef.current = navigator.geolocation.watchPosition(
    (pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setMyLocation(loc);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "location",
            lat: loc.lat,
            lng: loc.lng,
          })
        );
      }
    },
    (err) => console.error("GPS Error:", err),
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchIdRef.current);
}, []);


//   useEffect(() => {
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (pos) => {
//         const next = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };

//         setMyLocation((prev) =>
//           prev?.lat === next.lat && prev?.lng === next.lng ? prev : next
//         );

//         if (wsRef.current?.readyState === WebSocket.OPEN) {
//           wsRef.current.send(
//             JSON.stringify({
//               type: "location",
//               lat: next.lat,
//               lng: next.lng,
//             })
//           );
//         }
//       },
//       (err) => console.error("GPS Error:", err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchIdRef.current);
//   }, [currentUser, activeOrder]);


//   useEffect(() => {
//   if (!navigator.geolocation) {
//     console.error("❌ Geolocation not supported");
//     return;
//   }

//   console.log("🟡 Requesting GPS…");

//   const id = navigator.geolocation.watchPosition(
//     (pos) => {
//       console.log("🟢 GPS success:", pos.coords);

//       setMyLocation({
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude,
//       });
//     },
//     (err) => {
//       console.error("🔴 GPS error:", err.code, err.message);
//     },
//     {
//       enableHighAccuracy: false, // 👈 IMPORTANT
//       timeout: 20000,
//       maximumAge: 0,
//     }
//   );

//   return () => navigator.geolocation.clearWatch(id);
// }, []);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (!myLocation) {
//       console.warn("⚠️ GPS timeout → using fallback");
//       setMyLocation({ lat: 14.5995, lng: 120.9842 }); // Manila
//     }
//   }, 15000);

//   return () => clearTimeout(timer);
// }, [myLocation]);



  // --------------------
  // START DELIVERY
  // --------------------
  const startDelivery = useCallback(async (orderId) => {
    try {
      const res = await apiCall(
        `${import.meta.env.VITE_SERVER_URL}/driver/orders/${orderId}/start`,
        { method: "PUT" }
      );

      if (!res.ok) throw new Error("Failed to start delivery");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "delivering" } : o))
      );

      setActiveOrder((prev) =>
        prev?.id === orderId ? { ...prev, status: "delivering" } : prev
      );
    } catch (err) {
      console.error("Start delivery error:", err);
    }
  }, []);


  const mapCenter = useMemo(() => {
  if (myLocation) return [myLocation.lat, myLocation.lng];
  if (customerLocation) return [customerLocation.lat, customerLocation.lng];
  return [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
}, [myLocation, customerLocation]);


  // --------------------
  // ROLE GUARD
  // --------------------
  if (!currentUser || currentUser.role !== "driver") {
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
    <StaffHeader/>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6"> Driver Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAP */}
          <MapContainer
  center={mapCenter}
  zoom={15}
  className="lg:col-span-2 bg-white rounded-xl shadow h-[450px]"
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  {myLocation && (
    <Marker position={[myLocation.lat, myLocation.lng]}>
      <Popup>You</Popup>
    </Marker>
  )}

  {customerLocation && (
    <Marker position={[customerLocation.lat, customerLocation.lng]}>
      <Popup>Delivery Location</Popup>
    </Marker>
  )}
</MapContainer>


          {/* ORDERS */}
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h2 className="text-xl font-bold"> Assigned Orders</h2>

            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setActiveOrder(order)}
                className={`p-3 rounded-lg border cursor-pointer ${
                  activeOrder?.id === order.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <p className="font-semibold">Order #{order.id}</p>
                <p>Status: {order.status}</p>

                {order.status === "assigned" && (
                  <button
                    onClick={() => startDelivery(order.id)}
                    className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg"
                  >
                   Start Delivery
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DriverTrackingMap;
