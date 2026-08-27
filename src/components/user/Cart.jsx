import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiCreditCard,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();

  const getImageUrl = (url) => {
    if (!url) return "/placeholder-product.jpg";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  const getProduct = (item) => item.product || {};
  const getProductId = (item) =>
    item.productId || item.product?._id || item._id;

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = getProduct(item).price || 0;
        return sum + price * (item.quantity || 1);
      }, 0),
    [cartItems]
  );
  const shipping = subtotal > 2000 ? 0 : subtotal > 0 ? 200 : 0;
  const total = subtotal + shipping;

  const format = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-16"
    >
      <div className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm border-b z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <FiShoppingCart />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-sm text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{format(total)}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
              <FiShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Add products and they will show up here.
              </p>
              <Link
                to="/products"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = getProduct(item);
              const productId = getProductId(item);
              return (
                <motion.div
                  key={productId}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col sm:flex-row gap-6"
                >
                  <Link
                    to={`/product/${productId}`}
                    className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden"
                  >
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name || "Product"}
                      className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${productId}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                          {product.name || "Product"}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.brand || product.category || ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-indigo-600">
                          {format(product.price)}
                        </span>
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            product.quantity > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.quantity > 0 ? "In Stock" : "Added"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-1 bg-white border rounded-lg font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(productId, item.quantity + 1)
                          }
                          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">
                          {format((product.price || 0) * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(productId)}
                          className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md sticky top-24 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <FiCreditCard className="text-indigo-600" /> Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                  {shipping === 0 ? "Free" : format(shipping)}
                </span>
              </div>
              <div className="border-t border-gray-100 my-3"></div>
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">{format(total)}</span>
              </div>
            </div>

            <motion.button
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiCreditCard className="w-5 h-5" />
              Proceed to Checkout
            </motion.button>

            <Link
              to="/products"
              className="block text-center mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
