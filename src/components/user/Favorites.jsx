import { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiTrash2, FiShoppingCart, FiEye, FiStar, FiPackage, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [removing, setRemoving] = useState({});
  const { addToCart } = useCart();

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await api.get('/user/wishlist');
      setFavorites(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const removeFromFavorites = async (productId) => {
    setRemoving(prev => ({ ...prev, [productId]: true }));

    try {
      await api.delete(`/user/wishlist/${productId}`);

      setFavorites(prev => prev.filter(item => item.productId._id !== productId));
      showNotification("Removed from favorites!");
    } catch (error) {
      showNotification("Failed to remove from favorites", error.message);
    } finally {
      setRemoving(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1, product);
    } catch (error) {
      showNotification("Failed to add to cart", error.message);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const getRatingStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++)
      stars.push(<FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />);

    if (hasHalfStar)
      stars.push(<FiStar key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-70" />);

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);

    return stars;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading favorites..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <FiHeart className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Error Loading Favorites</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 ${notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
              }`}>
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, message: '', type: '' })}
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
          My Favorites
        </h1>
        <p className="text-gray-600 mt-2">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {/* Favorites Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiHeart className="w-16 h-16 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Start exploring our products and save your favorites here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiPackage className="w-6 h-6" />
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {favorites.map((item, index) => (
              <motion.div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {item.productId.images?.[0] ? (
                    <img
                      src={getImageUrl(item.productId.images[0])}
                      alt={item.productId.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <FiPackage className="w-16 h-16 mb-2" />
                      <span className="text-sm">No Image Available</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeFromFavorites(item.productId._id)}
                      disabled={removing[item.productId._id]}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {removing[item.productId._id] ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <FiTrash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.productId.name}
                  </h3>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">{getRatingStars()}</div>
                    <span className="text-sm text-gray-600">(4.5)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-600">{formatPrice(item.productId.price)}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.productId.quantity > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}>
                      {item.productId.quantity > 0 ? `${item.productId.quantity} available` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={item.productId.quantity === 0}
                      className="flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <Link
                      to={`/product/${item.productId._id}`}
                      className="flex-none bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <FiEye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;
