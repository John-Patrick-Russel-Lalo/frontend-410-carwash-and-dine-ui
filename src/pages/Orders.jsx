/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { apiCall } from "../Auth.js";
import CustomerHeader from "../components/CustomerHeader.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiCall(
          `${import.meta.env.VITE_SERVER_URL}/cart/orders`,
          { method: "GET" }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Your Orders
            </h1>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-6">
                  You have no orders yet
                </p>
                <button
                  onClick={() => window.location.replace("/menu")}
                  className="bg-gradient-to-r from-gray-500 to-gray-900 text-white py-3 px-8 rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-start md:items-center gap-4 p-4 border border-gray-200 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}/images/${order.image}`}
                        alt={order.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{order.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-1">{order.description}</p>
                      <p className="text-gray-900 font-medium mt-1">
                        ₱{(order.price * order.quantity).toLocaleString()} ({order.quantity} pcs)
                      </p>
                      <p
                        className={`mt-2 font-medium ${
                          order.status === "pending"
                            ? "text-yellow-600"
                            : order.status === "completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Status: {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
