/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { apiCall, getCurrentUser } from "../Auth.js";

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [message, setMessage] = useState("");

  const currentUser = getCurrentUser();

  // ---------------------------
  // FETCH ORDERS + DRIVERS
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersRes = await apiCall(
          `${import.meta.env.VITE_SERVER_URL}/kitchen/orders`,
          { method: "GET" }
        );

        if (!ordersRes.ok) throw new Error("Failed to fetch orders");

        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        console.log(ordersData)

        // Fetch drivers
        const driversRes = await apiCall(
          `${import.meta.env.VITE_SERVER_URL}/drivers`,
          { method: "GET" }
        );

        if (!driversRes.ok) throw new Error("Failed to fetch drivers");

        const driversData = await driversRes.json();
        setDrivers(driversData);

        console.log(driversData)
      } catch (err) {
        console.error("Failed to load:", err);
        setMessage("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
  const fetchData = async () => {
    try {
       const res = await apiCall(
          `${import.meta.env.VITE_SERVER_URL}/cart/orders`,
          { method: "GET" }
        );
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      // Status normalization ensures all works
      const normalized = data.map((o) => ({
        ...o,
        status: o.status?.toLowerCase() || "pending",
      }));

      setOrders(normalized);
      console.log(data);
    } catch (err) {
      console.error("Failed to load data:", err);
      setMessage("✗ Failed to load kitchen data");
    }
  };

  fetchData();
}, []);


  // ---------------------------
  // ROLE CHECK
  // ---------------------------
  if (!currentUser || currentUser.role !== "staff") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only for kitchen staff.</p>
        </div>
      </div>
    );
  }

  // ---------------------------
  // ASSIGN DRIVER
  // ---------------------------
  const handleAssignDriver = async () => {
    if (!selectedOrder || !selectedDriver) {
      setMessage("Please select both order and driver.");
      return;
    }

    try {
      setAssigningOrder(selectedOrder.id);

      const res = await apiCall(
        `${import.meta.env.VITE_SERVER_URL}/kitchen/orders/${selectedOrder.id}/assign-driver`,
        {
          method: "PUT",
          body: JSON.stringify({ driverId: selectedDriver.id }),
        }
      );

      if (!res.ok) throw new Error("Assignment failed");

      setMessage(`✓ Driver assigned to order #${selectedOrder.id}`);

      // Update UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, driverId: selectedDriver.id, driverName: selectedDriver.name }
            : o
        )
      );

      setSelectedOrder(null);
      setSelectedDriver(null);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Assign error:", err);
      setMessage("Failed to assign driver");
    } finally {
      setAssigningOrder(null);
    }
  };


  const handleChangeStatus = async (orderId, newStatus) => {
  try {
    const res = await apiCall(
      `${import.meta.env.VITE_SERVER_URL}/orders/${orderId}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) throw new Error("Failed to update status");

    const updated = await res.json();

    setMessage(`✓ Order #${orderId} is now '${newStatus}'`);

    // Update UI state instantly
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    setTimeout(() => setMessage(""), 2500);
  } catch (err) {
    console.error("Status update error:", err);
    setMessage("Failed to update status");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const assignedOrders = orders.filter((o) => o.driverId);
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Kitchen Dashboard</h1>
          <p className="text-gray-600">Manage orders efficiently</p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg font-medium ${
              message.startsWith("✓")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Assigned</p>
            <p className="text-3xl font-bold text-blue-600">{assignedOrders.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedOrders.length}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* PENDING ORDERS */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
              <h2 className="text-xl font-bold">Pending Orders</h2>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {pendingOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending orders</p>
              ) : (
                pendingOrders.map((order) => (
                    <>
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      selectedOrder?.id === order.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="font-semibold">Order #{order.id}</div>
                    <div className="text-sm text-gray-600">{order.name}</div>
                    <div className="text-sm text-gray-600">{order.description}</div>
                    <div className="text-sm font-medium text-orange-600">Qty: {order.quantity}</div>
                  </button>

                  <button
      onClick={() => handleChangeStatus(order.id, "cooking")}
      className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
    >
      Mark as Cooking 🍳
    </button>

                  </>
                ))
              )}
            </div>
          </div>

          {/* DRIVERS */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <h2 className="text-xl font-bold">Available Drivers</h2>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {drivers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No drivers available</p>
              ) : (
                drivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      selectedDriver?.id === driver.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold">{driver.name}</div>
                    <div className="text-sm text-gray-600">{driver.email}</div>
                  </button>
                ))
              )}

              {/* ASSIGN BUTTON */}
              <button
                onClick={handleAssignDriver}
                disabled={!selectedOrder || !selectedDriver}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {assigningOrder ? "Assigning..." : "Assign Driver"}
              </button>
            </div>
          </div>

          {/* ASSIGNED ORDERS */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
              <h2 className="text-xl font-bold">Assigned Orders</h2>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {assignedOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No assigned orders</p>
              ) : (
                assignedOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3 rounded-lg border border-green-200 bg-green-50"
                  >
                    <div className="font-semibold">Order #{o.id}</div>
                    <div className="text-sm text-gray-600">{o.name}</div>
                    <div className="text-sm font-medium text-green-600">
                      Driver: {o.driverName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-600">Status: {o.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
