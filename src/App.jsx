import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { refreshToken, apiCall } from "./Auth.js";

import Menu from "./pages/Menu.jsx";
import Landing from "./pages/Landing.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import ShowProduct from "./pages/ShowProduct.jsx";
import Cart from "./pages/Cart.jsx";

function App() {
  // ADD THIS ⬇⬇⬇
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        await refreshToken(); // 1️⃣ restore session first
        console.log("Session restored!");
      } catch {
        console.log("Not logged in.");
      }

      // 2️⃣ fetch products AFTER trying to refresh token
      try {
        const res = await apiCall(
          "https://four10-c-and-d-backend-server.onrender.com/menu/items",
          { method: "GET" }
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    init();
  }, []);

  // Dummy rating renderer (replace with yours)

  const renderRating = (rating) => (
    <div className="flex items-center">
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 fill-current ${
              i < Math.floor(rating) ? "" : "text-gray-300"
            }`}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.27L18.18 21L16.54 13.97
            L22 9.24L14.81 8.63L12 2
            L9.19 8.63L2 9.24L7.46 13.97
            L5.82 21L12 17.27Z"
            />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-900 ml-1">({rating})</span>
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/product/:id"
          element={
            <ShowProduct products={products} renderRating={renderRating} />
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      
    </>
  );
}

export default App;
