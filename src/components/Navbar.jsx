import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiPhone,
  FiTruck,
  FiGrid,
  FiMapPin,
  FiHeadphones,
} from "react-icons/fi";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png"; // ✅ FIXED IMPORT

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    return Array.isArray(roles)
      ? roles.includes(user.role)
      : user.role === roles;
  };

  const isCustomer = () => {
    return hasRole("buyer") || !user?.role;
  };

  const isAdmin = () => {
    return hasRole("admin");
  };

  const categories = [
    "Air conditioner",
    "Kitchen appliances",
    "PCs & laptop",
    "Gadgets",
    "Smart home",
    "Audio & video",
    "Refrigerator",
    "Home appliances",
  ];

  const navigation = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Compare",
      href: "/compare",
    },
    ...(!isAuthenticated ? [{ name: "Login", href: "/login" }] : []),
    ...(isAuthenticated
      ? [
        ...(isAdmin()
          ? [
            {
              name: "Dashboard",
              href: "/dashboard",
            },
          ]
          : []),
        {
          name: "New Arrivals",
          href: "/new-arrivals",
        },
      ]
      : []),
  ];

  const handleSearch = () => {
    const q = query.trim();
    if (q.length > 0) navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:block bg-white border-b border-gray-100/80 text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                <FiHeadphones className="w-4 h-4" />
                <span>Support 24/7</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                <FiTruck className="w-4 h-4" />
                <span>Fast delivery</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-gray-500">
              <div className="hidden lg:flex items-center gap-2 hover:text-gray-700 transition-colors">
                <FiMapPin className="w-4 h-4" />
                <span>Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`transition-all duration-300 ${scrolled ? "py-2" : "py-3"
          } bg-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 flex-shrink-0 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src={logo} width="40px" height="40px" alt="Logo" />
              </div>
              <span className="text-xl font-bold">
                Matab
                <span className="bg-gradient-to-r from-green-300 to-green-600 ml-1 bg-clip-text text-transparent">
                  Al-Shifa
                </span>
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 md:mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="block w-full pl-12 pr-24 py-2.5 border border-gray-200 rounded-full 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-gray-50 hover:bg-white transition-all duration-200
                           text-sm placeholder-gray-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="absolute inset-y-0 right-2 my-1.5 px-4 flex items-center
                           bg-gradient-to-r from-blue-600 to-purple-600 text-white
                           rounded-full text-sm font-medium hover:shadow-lg transition-all"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                title="Cart"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Customer Actions */}
                  {isCustomer() && (
                    <Link
                      to="/wishlist"
                      className="relative p-2 text-gray-600 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <FiHeart className="w-6 h-6" />
                    </Link>
                  )}

                  {isAdmin() && (
                    <>
                      <button className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors">
                        <FiBell className="w-6 h-6" />
                        <span
                          className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg"
                        >
                          3
                        </span>
                      </button>

                      <Link
                        to="/dashboard"
                        className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <FiGrid className="w-6 h-6" />
                      </Link>
                    </>
                  )}

                  {/* Profile */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="relative">
                      <ProfileModal>
                        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                          {user?.pic ? (
                            <img
                              src={user.pic}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="hidden lg:block text-left">
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name || user?.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {user?.role || "Customer"}
                            </p>
                          </div>
                          <FiChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </ProfileModal>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <FiGrid className="w-4 h-4" />
                  <span>All Categories</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {showCategories && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-fadeIn">
                    <Link
                      to="/products"
                      className="block w-full text-left px-4 py-3 text-sm text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 border-b border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <FiGrid className="w-4 h-4" />
                        <span>Browse All Products</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6">
                <Link
                  to="/new-arrivals"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/todays-deal"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Todays Deals
                </Link>
                <Link
                  to="/compare"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Compare
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2 hover:text-gray-700 transition-colors">
                <FiTruck className="w-4 h-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-gray-700 transition-colors">
                <FiPhone className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              {isAuthenticated && isCustomer() && (
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <span className="flex items-center space-x-3">
                    <FiShoppingCart className="w-5 h-5" />
                    <span className="font-medium">View Cart</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-white text-blue-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {!isAuthenticated && (
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <span className="flex items-center space-x-3">
                    <FiShoppingCart className="w-5 h-5" />
                    <span className="font-medium">View Cart</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-white text-blue-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <h3 className="px-4 text-sm font-semibold text-gray-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    className="block w-full text-left py-2 px-4 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
