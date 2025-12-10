/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { apiCall } from "../Auth.js";
import CustomerHeader from "../components/CustomerHeader.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(50);
  const [taxRate, setTaxRate] = useState(0); // 12% tax

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax - discount;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await apiCall(
          `${import.meta.env.VITE_SERVER_URL}/cart/carts`,
          { method: "GET" }
        );

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    // update UI instantly
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // send to server
    await apiCall(`${import.meta.env.VITE_SERVER_URL}/cart/updateQuantity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: newQuantity }),
    });
  };

  // Remove item
  const removeFromCart = async (id) => {
    try {
      const res = await apiCall(
        `${import.meta.env.VITE_SERVER_URL}/cart/removeCart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      if (!res.ok) throw new Error("Failed to remove item");

      // Update UI instantly
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  //   const placeOrder = async () => {
  //   try {
  //     const res = await apiCall(
  //       `${import.meta.env.VITE_SERVER_URL}/cart/placeOrder`,
  //       {
  //         method: "POST",
  //         credentials: "include"
  //       }
  //     );

  //     if (!res.ok) throw new Error("Failed to place order");

  //     setCartItems([]);

  //   } catch (err) {
  //     console.error("Failed to place order:", err);
  //   }
  // };
  const placeOrder = async () => {
    try {
      const res = await apiCall(
        `${import.meta.env.VITE_SERVER_URL}/cart/placeOrder`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              menuId: item.item_id,
              quantity: item.quantity,
              price: Number(item.price) 
            })),
          }),
        }
      );
      console.log(cartItems);
      if (!res.ok) throw new Error("Failed to place order");

      setCartItems([]);
    } catch (err) {
      console.error("Failed to place order:", err);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    // In a real app, you'd validate this with a server
    if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
  };

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Your Shopping Cart
              </h1>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition font-medium"
              >
                Clear Cart
              </button>
            </div>

            {cartItems.length === 0 ? (
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
                <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
                <button
                  onClick={() => window.location.replace("/menu")}
                  className="bg-gradient-to-r from-gray-500 to-gray-900 text-white py-3 px-8 rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-8">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap md:flex-wrap items-start md:items-center gap-4 p-4 border border-gray-200 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={`${import.meta.env.VITE_SERVER_URL}/images/${
                            item.image
                          }`}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-lg"
                        />
                        {item.badge && (
                          <span className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {item.description}
                        </p>
                        <p className="text-gray-900 font-medium mt-1">
                          ₱{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg text-lg font-bold hover:bg-gray-300 transition"
                        >
                          −
                        </button>
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg text-lg font-bold hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-gray-900 font-semibold">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-red-500 font-medium px-3 py-1 rounded-lg 
             hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Promo Code */}
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Promo Code
                      </h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-gradient-to-r from-gray-500 to-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                        >
                          Apply
                        </button>
                      </div>
                      {discount > 0 && (
                        <p className="text-green-600 text-sm mt-2">
                          Promo code applied! You saved ₱
                          {discount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Order Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            ₱{subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">
                            ₱{shipping.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Tax ({(taxRate * 100).toFixed(0)}%)
                          </span>
                          <span className="font-medium">
                            ₱{tax.toLocaleString()}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">
                              -₱{discount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
                          <span className="font-semibold text-gray-800">
                            Total
                          </span>
                          <span className="font-bold text-lg text-gray-900">
                            ₱{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => window.location.replace("/menu")}
                      className="px-6 py-3 rounded-xl border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition-all"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => placeOrder()}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-900 text-white py-3 rounded-xl font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
