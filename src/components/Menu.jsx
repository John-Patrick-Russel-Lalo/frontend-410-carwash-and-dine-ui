// const menu = () => {

//     return (
//         <>
//             <section className="max-w-[520px] mx-auto grid grid-cols-2 gap-4 p-4">

//                 {/* Card 1 */}
//                 <article className="bg-white rounded-xl p-3 shadow border">
//                     <img 
//                         src="https://via.placeholder.com/150" 
//                         className="w-full h-28 object-cover rounded-lg"
//                     />
//                     <h1 className="text-sm font-semibold mt-2">Spicy Noodles</h1>
//                     <p className="text-orange-600 font-bold text-sm">₱150</p>
//                     <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
//                         View Cart
//                     </button>
//                 </article>

//                 {/* Card 2 */}
//                 <article className="bg-white rounded-xl p-3 shadow border">
//                     <img 
//                         src="https://via.placeholder.com/150" 
//                         className="w-full h-28 object-cover rounded-lg"
//                     />
//                     <h1 className="text-sm font-semibold mt-2">Shrimp Pasta</h1>
//                     <p className="text-orange-600 font-bold text-sm">₱180</p>
//                     <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
//                         View Cart
//                     </button>
//                 </article>

//                 {/* Card 3 */}
//                 <article className="bg-white rounded-xl p-3 shadow border">
//                     <img 
//                         src="https://via.placeholder.com/150" 
//                         className="w-full h-28 object-cover rounded-lg"
//                     />
//                     <h1 className="text-sm font-semibold mt-2">Vegetable Curry</h1>
//                     <p className="text-orange-600 font-bold text-sm">₱120</p>
//                     <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
//                         View Cart
//                     </button>
//                 </article>

//                 {/* Card 4 */}
//                 <article className="bg-white rounded-xl p-3 shadow border">
//                     <img 
//                         src="https://via.placeholder.com/150" 
//                         className="w-full h-28 object-cover rounded-lg"
//                     />
//                     <h1 className="text-sm font-semibold mt-2">Mixed Salad</h1>
//                     <p className="text-orange-600 font-bold text-sm">₱150</p>
//                     <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
//                         View Cart
//                     </button>
//                 </article>

//                 {/* Card 5 */}
//                 <article className="bg-white rounded-xl p-3 shadow border">
//                     <img 
//                         src="https://via.placeholder.com/150" 
//                         className="w-full h-28 object-cover rounded-lg"
//                     />
//                     <h1 className="text-sm font-semibold mt-2">Chicken Pasta Salad</h1>
//                     <p className="text-orange-600 font-bold text-sm">₱150</p>
//                     <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
//                         View Cart
//                     </button>
//                 </article>

//                 {/* Card 6 */}
//                 <article className="bg-white rounded-xl p-3 shadow border">
//                     <img 
//                         src="https://via.placeholder.com/150" 
//                         className="w-full h-28 object-cover rounded-lg"
//                     />
//                     <h1 className="text-sm font-semibold mt-2">Beef Salad</h1>
//                     <p className="text-orange-600 font-bold text-sm">₱120</p>
//                     <button className="mt-2 w-full bg-orange-500 text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
//                         View Cart
//                     </button>
//                 </article>

//             </section>
//         </>
//     )
// }

// export default menu;


// // day 1 - fix pull request

// // day 1 - fixed pull request

import { useState } from 'react';

const Menu = () => {
  const products = [
    {
      id: 1,
      name: "Spicy Noodles",
      description: "Fiery heat, rich umami flavor, and satisfying texture. The spice is delivered through flavorful sauces, broths, and oils infused with various types of chili peppers.",
      price: 12.99,
      originalPrice: 15.99,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 4.5,
      badge: "SPICY",
      category: "meals"
    },
    {
      id: 2,
      name: "Sushi Platter",
      description: "Freshly prepared sushi with premium ingredients. Includes salmon, tuna, shrimp, and avocado with perfectly seasoned rice.",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 4.8,
      category: "meals"
    },
    {
      id: 3,
      name: "Vegetable Stir Fry",
      description: "Colorful mix of fresh vegetables stir-fried with aromatic herbs and spices. A healthy and delicious vegetarian option.",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 4.3,
      category: "meals"
    },
    {
      id: 4,
      name: "BBQ Chicken Pizza",
      description: "Tender grilled chicken, tangy BBQ sauce, red onions, and cilantro on a crispy thin crust. A crowd favorite.",
      price: 14.99,
      originalPrice: 17.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 4.6,
      badge: "POPULAR",
      category: "meals"
    },
    {
      id: 5,
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice with no added sugars.",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1553541474-519d9d6ecf5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 4.7,
      category: "drinks"
    },
    {
      id: 6,
      name: "Chocolate Cake",
      description: "Rich and moist chocolate cake with chocolate ganache.",
      price: 6.99,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb73c3a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 4.9,
      category: "desserts"
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 fill-current ${i < Math.floor(rating) ? '' : 'text-gray-300'}`} 
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 4.63 0.82 5.24 7.27 9.97 5.64 17z"/>
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  // Customer Comments Component
  const CustomerComments = () => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
      {
        id: 1,
        name: "John Doe",
        comment: "Amazing food! The spicy noodles were exactly what I was looking for.",
        date: "2023-05-15",
        rating: 5
      },
      {
        id: 2,
        name: "Sarah Miller",
        comment: "Great service and delicious food. Will definitely order again!",
        date: "2023-05-12",
        rating: 4
      }
    ]);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (comment.trim()) {
        const newComment = {
          id: comments.length + 1,
          name: "Anonymous User",
          comment: comment,
          date: new Date().toISOString().split('T')[0],
          rating: 4
        };
        setComments([newComment, ...comments]);
        setComment('');
      }
    };
    
    return (
      <section className="mt-12 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Customer Comments</h2>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Write your comment here..."
            rows="4"
          ></textarea>
          
          <button 
            type="submit"
            className="w-full text-white py-3 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            Submit Comment
          </button>
        </form>
        
        {/* Comments List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Comments</h3>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{c.name}</p>
                      <span className="text-sm text-gray-500">{c.date}</span>
                    </div>
                    <div className="flex text-amber-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 fill-current ${i < c.rating ? '' : 'text-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Menu</h1>
        
        {/* Category Navigation */}
        <section className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105 border ${
                selectedCategory === 'all' 
                  ? 'bg-orange-500 text-white border-orange-500' 
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              All Items
            </button>
            <button 
              onClick={() => setSelectedCategory('meals')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105 border ${
                selectedCategory === 'meals' 
                  ? 'bg-orange-500 text-white border-orange-500' 
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Meals
            </button>
            <button 
              onClick={() => setSelectedCategory('drinks')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105 border ${
                selectedCategory === 'drinks' 
                  ? 'bg-orange-500 text-white border-orange-500' 
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Drinks
            </button>
            <button 
              onClick={() => setSelectedCategory('desserts')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105 border ${
                selectedCategory === 'desserts' 
                  ? 'bg-orange-500 text-white border-orange-500' 
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Desserts
            </button>
          </div>
        </section>
        
        {selectedProduct ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="relative">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-80 md:h-full object-cover"
                  />
                  {selectedProduct.badge && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {selectedProduct.badge}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2 p-6 md:p-8">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="flex items-center text-orange-600 hover:text-orange-800 mb-4"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Menu
                </button>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h1>
                {renderRating(selectedProduct.rating)}
                
                <div className="my-4">
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-orange-600">${selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-gray-500 line-through ml-2">${selectedProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
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
                
                {/* Comments section in product detail view */}
                <CustomerComments />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.badge && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                      {renderRating(product.rating)}
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-xl font-bold text-orange-600">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through text-sm ml-1">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Comments section in product list view */}
            <CustomerComments />
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;