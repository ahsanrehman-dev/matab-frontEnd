import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiStar, FiShoppingCart, FiHeart, FiClock } from "react-icons/fi";
import api, { productApi } from "../utils/api";
import { useCart } from "../context/CartContext";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data = await productApi.getNewArrivals();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading new arrivals..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Error Loading New Arrivals
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-16 px-6 text-center mb-12">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white/20 p-5 rounded-full text-4xl">
            <FiClock />
          </div>
          <h1 className="text-4xl font-extrabold">New Arrivals</h1>
          <p className="text-indigo-100 text-lg max-w-lg mx-auto">
            Discover the latest products added to our collection
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="bg-white text-center p-10 rounded-2xl shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No new arrivals yet
            </h3>
            <p className="text-gray-500 mb-6">
              Check back soon for the latest products!
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="relative group block"
                >
                  <img
                    src={getImageUrl(product.images?.[0]) || "/placeholder-product.jpg"}
                    alt={product.name}
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-pulse">
                    NEW
                  </div>

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-sm transition-opacity">
                    View Details
                  </div>
                </Link>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  )}

                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`${star <= 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="text-gray-500 text-sm">(4.0)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xl font-bold text-green-600">
                      PKR {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-gray-400 line-through text-sm">
                          PKR {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                  </div>

                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${product.quantity > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-5 pt-0">
                  <button
                    onClick={() => addToCart(product._id, 1, product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-300 transition-all">
                    <FiHeart />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-2xl py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">
          Can’t find what you’re looking for?
        </h2>
        <p className="text-white/90 mb-8">
          Browse our complete collection of products
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transition-all"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
};

export default NewArrivals;
