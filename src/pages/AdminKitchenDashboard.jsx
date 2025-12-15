// /* eslint-disable no-unused-vars */
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { apiCall, getCurrentUser } from "../Auth.js";
// import StaffHeader from "../components/StaffHeader.jsx";

// const POLL_INTERVAL = 5000;

// const STATUS_OPTIONS = ["pending", "cooking", "ready", "completed"];

// const AdminKitchenDashboard = () => {
//   const currentUser = useMemo(() => getCurrentUser(), []);

//   const [orders, setOrders] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --------------------
//   // FETCH ORDERS
//   // --------------------
//   const fetchOrders = useCallback(async () => {
//     try {
//       const res = await apiCall(
//         `${import.meta.env.VITE_SERVER_URL}/kitchen/orders`,
//         { method: "GET" }
//       );

//       if (!res.ok) throw new Error("Failed to fetch orders");

//       const data = await res.json();
//       setOrders(data);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // --------------------
//   // FETCH DRIVERS
//   // (you can replace endpoint if needed)
//   // --------------------
//   const fetchDrivers = useCallback(async () => {
//     try {
//       const res = await apiCall(
//         `${import.meta.env.VITE_SERVER_URL}/users?role=driver`,
//         { method: "GET" }
//       );

//       if (res.ok) {
//         const data = await res.json();
//         setDrivers(data);
//       }
//     } catch (err) {
//       console.error("Fetch drivers error:", err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders();
//     fetchDrivers();

//     const interval = setInterval(fetchOrders, POLL_INTERVAL);
//     return () => clearInterval(interval);
//   }, [fetchOrders, fetchDrivers]);

//   // --------------------
//   // UPDATE STATUS
//   // --------------------
//   const updateStatus = async (orderId, status) => {
//     try {
//       const res = await apiCall(
//         `${import.meta.env.VITE_SERVER_URL}/kitchen/orders/${orderId}/status`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to update status");

//       fetchOrders();
//     } catch (err) {
//       console.error("Status update error:", err);
//     }
//   };

//   // --------------------
//   // ASSIGN DRIVER
//   // --------------------
//   const assignDriver = async (orderId, driverId) => {
//     try {
//       const res = await apiCall(
//         `${import.meta.env.VITE_SERVER_URL}/kitchen/orders/${orderId}/assign-driver`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ driverId }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to assign driver");

//       fetchOrders();
//     } catch (err) {
//       console.error("Assign driver error:", err);
//     }
//   };

//   // --------------------
//   // ROLE GUARD
//   // --------------------
//   if (!currentUser || currentUser.role !== "staff") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
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
//     <>
//       <StaffHeader />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold mb-6">🍳 Kitchen Admin Dashboard</h1>

//           <div className="grid grid-cols-1 gap-4">
//             {orders.map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-white rounded-xl shadow p-4 space-y-2"
//               >
//                 <div className="flex justify-between items-center">
//                   <h2 className="font-bold text-lg">
//                     Order #{order.id} — {order.name}
//                   </h2>
//                   <span className="text-sm text-gray-500">
//                     {new Date(order.created_at).toLocaleString()}
//                   </span>
//                 </div>

//                 <p>👤 Customer: {order.customer_name}</p>
//                 <p>📧 Email: {order.customer_email}</p>
//                 <p>🍽 Quantity: {order.quantity}</p>

//                 {/* STATUS */}
//                 <div className="flex items-center gap-2">
//                   <label className="font-semibold">Status:</label>
//                   <select
//                     value={order.status}
//                     onChange={(e) =>
//                       updateStatus(order.id, e.target.value)
//                     }
//                     className="border rounded px-2 py-1"
//                   >
//                     {STATUS_OPTIONS.map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* ASSIGN DRIVER */}
//                 <div className="flex items-center gap-2">
//                   <label className="font-semibold">Driver:</label>
//                   <select
//                     onChange={(e) =>
//                       assignDriver(order.id, e.target.value)
//                     }
//                     className="border rounded px-2 py-1"
//                     defaultValue=""
//                   >
//                     <option value="" disabled>
//                       Assign driver
//                     </option>
//                     {drivers.map((d) => (
//                       <option key={d.id} value={d.id}>
//                         {d.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminKitchenDashboard;

/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { apiCall, getCurrentUser, logout } from "../Auth.js";

const DEFAULT_CENTER = [14.5995, 120.9842];
const POLL_INTERVAL = 5000;

const STATUS_COLORS = {
  pending: "bg-yellow-400",
  cooking: "bg-orange-400",
  ready: "bg-green-500",
  completed: "bg-blue-500",
};

const AdminKitchenDashboard = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 

  // --------------------
  // FETCH ORDERS
  // --------------------
  const fetchOrders = useCallback(async () => {
    try {
      const res = await apiCall(
        `${import.meta.env.VITE_SERVER_URL}/kitchen/orders`,
        { method: "GET" }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const i = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(i);
  }, [fetchOrders]);

  // --------------------
  // DERIVED DATA
  // --------------------
  const stats = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === "pending").length,
      cooking: orders.filter(o => o.status === "cooking").length,
      ready: orders.filter(o => o.status === "ready").length,
      completed: orders.filter(o => o.status === "completed").length,
    };
  }, [orders]);

  const mapOrders = orders.filter(o => o.status !== "completed");

  // --------------------
  // ROLE GUARD
  // --------------------
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-gray-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-200">

      {/* SIDEBAR */}
      <aside className="w-56 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Kitchen Admin</h1>

        <nav className="space-y-3 text-sm">
          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-800">
            Dashboard
          </button>
          
          <hr className="border-gray-700 my-4" />
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded text-red-400 hover:bg-red-500 hover:text-white ">
            Log out
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        {/* TOP BAR */}
        <header className="px-6 py-4 bg-gray-300">
          <h1 className="font-semibold">Dashboard Overview</h1>
        </header>

        {/* CONTENT */}
        <main className="p-6">
          <div className="bg-gray-300 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-9 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-3 space-y-6">

              {/* ORDER STATUS */}
              <div className="bg-gray-200 p-4 rounded-lg h-64">
                <h3 className="text-sm font-semibold mb-3">Order Status</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-white rounded p-3 flex justify-between">
                      <span className="capitalize">{key}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT ORDERS */}
              <div className="bg-gray-200 p-4 rounded-lg h-64 overflow-auto">
                <h3 className="text-sm font-semibold mb-3">Recent Orders</h3>
                <div className="space-y-2 text-xs">
                  {orders.slice(0, 6).map(o => (
                    <div
                      key={o.id}
                      className="bg-white p-2 rounded flex justify-between items-center"
                    >
                      <span>#{o.id} • {o.customer_name}</span>
                      <span className={`px-2 py-1 rounded text-white ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* CENTER COLUMN */}
            <div className="lg:col-span-6 space-y-6">

              {/* MAP */}
              <div className="bg-gray-200 p-4 rounded-lg h-64">
                <h3 className="text-sm font-semibold mb-3 text-center">
                  Active Deliveries
                </h3>

                <MapContainer
                  center={DEFAULT_CENTER}
                  zoom={13}
                  className="h-full rounded-md"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {mapOrders.map(o =>
                    o.lat && o.lng ? (
                      <Marker key={o.id} position={[o.lat, o.lng]}>
                        <Popup>
                          Order #{o.id}<br />
                          {o.customer_name}
                        </Popup>
                      </Marker>
                    ) : null
                  )}
                </MapContainer>
              </div>

              {/* ANALYTICS */}
              <div className="bg-gray-200 p-4 rounded-lg h-36">
                <h3 className="text-sm font-semibold mb-4 text-center">
                  Orders by Status
                </h3>

                <div className="flex items-end justify-between h-full gap-4 px-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center w-full">
                      <div
                        className={`${STATUS_COLORS[key]} w-8 rounded-t`}
                        style={{ height: `${Math.max(value * 10, 10)}%` }}
                      />
                      <span className="text-xs mt-2 capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminKitchenDashboard;
