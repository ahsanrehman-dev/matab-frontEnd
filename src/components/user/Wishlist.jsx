import { useState, useEffect } from "react";
import { FiHeart, FiTrash2, FiShoppingCart, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../../utils/api";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await api.get('/user/wishlist');
      setWishlistItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);

      setWishlistItems((prev) =>
        prev.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1, product);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600 text-lg animate-pulse">
        Loading wishlist...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        My Wishlist ❤️
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-gray-50 p-12 rounded-2xl shadow-sm">
          <FiHeart size={60} className="text-red-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No items in your wishlist yet
          </h3>
          <p className="text-gray-500 mb-6">
            Products you wishlist will appear here.
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative h-56 bg-gray-100">
                {item.productId.images && item.productId.images[0] ? (
                  <img
                    src={getImageUrl(item.productId.images[0])}
                    alt={item.productId.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                {/* Remove button overlay */}
                <button
                  onClick={() => removeFromWishlist(item.productId._id)}
                  className="absolute top-3 right-3 bg-white/80 text-red-600 hover:text-red-700 p-2 rounded-full shadow-md transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                    {item.productId.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {item.productId.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-green-600 font-semibold text-lg">
                      PKR {item.productId.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-medium ${item.productId.quantity > 0
                        ? "text-green-600"
                        : "text-red-500"
                        }`}
                    >
                      {item.productId.quantity > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    disabled={item.productId.quantity === 0}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${item.productId.quantity === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>

                  <Link
                    to={`/product/${item.productId._id}`}
                    className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  >
                    <FiEye />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
