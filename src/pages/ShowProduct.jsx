/* eslint-disable no-unused-vars */
import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { apiCall } from "../Auth.js";

async function addToCart(itemId, quantity) {
  try {
    const res = await apiCall(`${import.meta.env.VITE_SERVER_URL}/cart/addToCart`, {
      method: "POST",
      body: JSON.stringify({
        item_id: itemId,
        quantity: quantity,
      }),
    });
    console.log("Add to cart response:", res);
    const data = await res.json();
    window.location.replace("/cart");

    if (!res.ok) {
      throw new Error(data.error || "Failed to place cart");
    }

    return data;
  } catch (err) {
    console.error("Cart error:", err);
    throw err;
  }
}

const ShowProduct = ({ products, renderRating }) => {
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();

  if (!products || products.length === 0) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/images/${product.image}`}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-2xl shadow-md"
          />

          {product.badge && (
            <span className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1 text-xs rounded-full shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.name}
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <p className="text-2xl font-semibold text-gray-900 mb-6">
            ₱{product.price?.toLocaleString()}
          </p>

          {/* QUANTITY SELECTOR */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Quantity
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-xl text-lg font-bold hover:bg-gray-300 transition"
              >
                −
              </button>

              <span className="text-xl font-semibold w-10 text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-xl text-lg font-bold hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => addToCart(product.id, quantity)} className="flex-1 bg-gradient-to-r from-gray-500 to-gray-900 text-white py-3 rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md">
              Add to Cart
            </button>

           

            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl border border-gray-400 text-gray-700 font-medium hover:bg-gray-200 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
