import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  return (
    <header className="bg-gradient-to-r from-fire-red to-fire-orange text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleBack}
                className="p-2 hover:text-fire-yellow transition text-white"
                title="Go Back"
                aria-label="Go Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleForward}
                className="p-2 hover:text-fire-yellow transition text-white"
                title="Go Forward"
                aria-label="Go Forward"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">🎆</span>
              <span className="text-2xl font-bold">Firecracker Store</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-fire-yellow transition">Home</Link>
            <Link to="/category/day-crackers" className="hover:text-fire-yellow transition">Day Crackers</Link>
            <Link to="/category/night-crackers" className="hover:text-fire-yellow transition">Night Crackers</Link>
            <Link to="/category/accessories" className="hover:text-fire-yellow transition">Customize Boxes</Link>
            <Link to="/category/display-boxes" className="hover:text-fire-yellow transition">Gift Boxes</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:text-fire-yellow transition">
                  {user.name}
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="hover:text-fire-yellow transition">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="hover:text-fire-yellow transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-fire-yellow transition">Login</Link>
                <Link to="/register" className="bg-white text-fire-red px-4 py-2 rounded hover:bg-fire-yellow transition">
                  Register
                </Link>
              </>
            )}
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-fire-yellow text-fire-red rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-fire-yellow transition">Home</Link>
            <Link to="/category/day-crackers" className="block py-2 hover:text-fire-yellow transition">Day Crackers</Link>
            <Link to="/category/night-crackers" className="block py-2 hover:text-fire-yellow transition">Night Crackers</Link>
            <Link to="/category/accessories" className="block py-2 hover:text-fire-yellow transition">Customize Boxes</Link>
            <Link to="/category/display-boxes" className="block py-2 hover:text-fire-yellow transition">Gift Boxes</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;




