import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Store Ratings
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              {/* Admin Navigation Links */}
              {user.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className="hover:text-blue-200">
                    Users
                  </Link>
                  <Link to="/admin/stores" className="hover:text-blue-200">
                    Stores
                  </Link>
                  <Link to="/admin/profile" className="hover:text-blue-200">
                    Profile
                  </Link>
                </>
              )}

              {/* Store Owner Navigation Links */}
              {user.role === "storeOwner" && (
                <>
                  <Link
                    to="/store-owner/dashboard"
                    className="hover:text-blue-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/store-owner/profile"
                    className="hover:text-blue-200"
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* Regular User Navigation Links */}
              {user.role === "user" && (
                <>
                  <Link to="/user/stores" className="hover:text-blue-200">
                    Stores
                  </Link>
                  <Link to="/user/profile" className="hover:text-blue-200">
                    Profile
                  </Link>
                </>
              )}

              {/* User info and logout */}
              <span className="px-2">|</span>
              <span className="font-medium">{user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 bg-blue-700 p-4 rounded shadow-lg md:hidden">
            {user ? (
              <div className="flex flex-col space-y-3">
                {/* Admin links */}
                {user.role === "admin" && (
                  <>
                    <Link to="/admin/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/admin/users" className="hover:text-blue-200">
                      Users
                    </Link>
                    <Link to="/admin/stores" className="hover:text-blue-200">
                      Stores
                    </Link>
                    <Link to="/admin/profile" className="hover:text-blue-200">
                      Profile
                    </Link>
                  </>
                )}

                {/* Store Owner links */}
                {user.role === "storeOwner" && (
                  <>
                    <Link
                      to="/store-owner/dashboard"
                      className="hover:text-blue-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/store-owner/profile"
                      className="hover:text-blue-200"
                    >
                      Profile
                    </Link>
                  </>
                )}

                {/* Regular User links */}
                {user.role === "user" && (
                  <>
                    <Link to="/user/stores" className="hover:text-blue-200">
                      Stores
                    </Link>
                    <Link to="/user/profile" className="hover:text-blue-200">
                      Profile
                    </Link>
                  </>
                )}

                {/* User info and logout */}
                <div className="pt-2 border-t border-blue-500">
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="hover:text-blue-200">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-center"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
