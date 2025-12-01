// const ViewProduct = () => {
//   return (
//     <>
//       <section className="p-6 max-w-lg mx-auto">

//         <div className=" bg-amber-50 p-6 rounded-xl">
//         <img 
//           src=""
//           alt="Food"
//           className="w-full h-56 object-cover rounded-xl mb-4"
//         />

       
//         <h1 className="text-2xl font-bold">Spicy Noodles</h1>

        
//         <p className="text-gray-600 mt-2">
//          Spicy noodles are a popular and diverse category of dishes, predominantly originating from Asia, 
//          known for their fiery heat, rich umami flavor, and satisfying texture. The spice is typically 
//          delivered through flavorful sauces, broths, and oils infused with various types of chili peppers.
//         </p>

        
//         <div className="mt-5 flex flex-col gap-3">
//           <button className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-red-700">
//             Add to Cart
//           </button>

//           <button className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-red-700">
//             Go to Checkout
//           </button>
//         </div>
//       </div>
//       </section>
//     </>
//   );
// };


// export default ViewProduct;






const ViewProduct = () => {
  return (
    <>
      <section className="p-6 max-w-lg mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-amber-100 transition-all duration-300 hover:shadow-xl">
          {/* Product Image */}
          <div className="relative">
            <img 
              src=""
              alt="Food"
              className="w-full h-64 object-cover"
            />
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              SPICY
            </div>
          </div>
          
          {/* Product Content */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Spicy Noodles</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L  2 2 9.19 4.63 0.82 5.24 7.27 9.97 5.64 17z"/>
                </svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 4.63 0.82 5.24 7.27 9.97 5.64 17z"/>
                </svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 4.63 0.82 5.24 7.27 9.97 5.64 17z"/>
                </svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 4.63 0.82 5.24 7.27 9.97 5.64 17z"/>
                </svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 4.63 0.82 5.24 7.27 9.97 5.64 17z"/>
                </svg>
              </div>
              <span className="text-sm text-gray-500 ml-2">(4.5)</span>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Spicy noodles are a popular and diverse category of dishes, predominantly originating from Asia, 
              known for their fiery heat, rich umami flavor, and satisfying texture. The spice is typically 
              delivered through flavorful sauces, broths, and oils infused with various types of chili peppers.
            </p>

            {/* Price */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-3xl font-bold text-orange-600">$12.99</span>
                <span className="text-gray-500 line-through ml-2">$15.99</span>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                <span className="px-3 py-1">1</span>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </div>
              </button>

              <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Buy Now
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewProduct;