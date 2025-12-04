import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


const CustomerHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // For example: 
    // localStorage.removeItem('authToken');
    // window.location.href = '/login';
    alert('You have been logged out');
  };

  // Determine active link class
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'text-white bg-gray-900' 
        : 'text-gray-600 hover:text-white hover:bg-gray-800'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">410</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-800">Carwash and Dine</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/menu" 
              className={getLinkClass('/menu')}
            >
              Menu
            </a>
            <a 
              href="/map" 
              className={getLinkClass('/map')}
            >
              Map
            </a>
            <a 
              href="/cart" 
              className={getLinkClass('/cart')}
            >
              Cart
            </a>
            <a 
              href="/history" 
              className={getLinkClass('/history')}
            >
              History
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col text-center">
              <a 
                href="/menu" 
                className={getLinkClass('/menu')}
              >
                Menu
              </a>
              <a 
                href="/map" 
                className={getLinkClass('/map')}
              >
                Map
              </a>
              <a 
                href="/cart" 
                className={getLinkClass('/cart')}
              >
                Cart
              </a>
              <a 
                href="/history" 
                className={getLinkClass('/history')}
              >
                History
              </a>
              <button 
                onClick={handleLogout}
                className="w-full flex justify-center items-center text-left px-3 py-2 text-gray-600 hover:text-gray-100 hover:bg-gray-900 rounded-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomerHeader;