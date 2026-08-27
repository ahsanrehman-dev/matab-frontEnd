import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiArrowLeft,
  FiBarChart2,
  FiPackage,
  FiCheck,
  FiMinus,
  FiPlus,
  FiInfo,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../utils/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${productId}`);
        setProduct(data.product || data);
      } catch (error) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.get(`/user/wishlist/check/${productId}`);
        setIsWishlisted(res.isWishlisted);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };
    checkWishlist();
  }, [isAuthenticated, productId]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity, product);
    } catch {
      // toast is shown by cart context
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (product.quantity <= 0) return;
    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({ product, quantity })
    );
    navigate("/checkout", { state: { buyNow: true } });
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsAddingToWishlist(true);
    try {
      if (isWishlisted) {
        await api.delete(`/user/wishlist/${product._id}`);
        setIsWishlisted(false);
      } else {
        await api.post("/user/wishlist", { productId: product._id });
        setIsWishlisted(true);
      }
    } catch {
      alert("Wishlist update failed");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleQuantityChange = (val) => {
    if (val >= 1 && val <= product.quantity) setQuantity(val);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
        <p className="text-gray-700 font-semibold text-lg">
          Loading product details...
        </p>
      </div>
    );

  if (error || !product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "This product doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 font-semibold flex items-center gap-2 mx-auto transition-all"
          >
            <FiArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) *
        100
      )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Product Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-100 shadow-inner">
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg shadow-lg">
                      {discount}% OFF
                    </span>
                  </div>
                )}
                <motion.img
                  key={selectedImage}
                  src={
                    getImageUrl(product.images?.[selectedImage]) ||
                    "/placeholder-product.jpg"
                  }
                  alt={product.name}
                  className="object-contain w-full h-full p-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square rounded-xl overflow-hidden border-3 transition-all hover:scale-105 ${selectedImage === i
                        ? "border-blue-600 ring-2 ring-blue-600/20 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.5</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">128 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-4 mb-2">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    PKR {product.price?.toLocaleString()}
                  </h2>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-gray-400 line-through mb-1">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-green-600 font-semibold">
                    You save PKR{" "}
                    {(product.originalPrice - product.price).toLocaleString()} (
                    {discount}%)
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl shadow-sm ${product.quantity > 20
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : product.quantity > 0
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                >
                  {product.quantity > 0 ? (
                    <>
                      <FiCheck className="w-4 h-4" />
                      In Stock ({product.quantity} available)
                    </>
                  ) : (
                    <>
                      <FiInfo className="w-4 h-4" />
                      Out of Stock
                    </>
                  )}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
                <div className="mb-6">
                  <label className="block font-bold text-gray-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiMinus className="w-5 h-5" />
                      </button>
                      <div className="w-16 h-12 flex items-center justify-center font-bold text-gray-900 text-lg border-x-2 border-gray-300">
                        {quantity}
                      </div>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.quantity}
                        className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {product.quantity} items available
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  disabled={product.quantity <= 0}
                  className={`cursor-pointer w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all shadow-md ${product.quantity <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                    }`}
                >
                  <FiPackage className="w-5 h-5" />
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.quantity <= 0}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all shadow-md ${product.quantity <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                    }`}
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWishlist}
                    disabled={isAddingToWishlist}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all shadow-md border-2 ${isWishlisted
                      ? "bg-red-600 border-red-700 text-white hover:bg-red-700"
                      : "bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
                      }`}
                  >
                    <FiHeart
                      className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`}
                    />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </button>

                  <button
                    onClick={() =>
                      navigate("/compare", {
                        state: { productToCompare: product },
                      })
                    }
                    className="flex items-center justify-center gap-2 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-md"
                  >
                    <FiBarChart2 className="w-5 h-5" />
                    Compare
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <FiTruck className="text-white w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    Free Delivery
                  </span>
                  <span className="text-xs text-gray-600">
                    On orders above PKR 2000
                  </span>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <FiShield className="text-white w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    1-Year Warranty
                  </span>
                  <span className="text-xs text-gray-600">
                    Manufacturer warranty
                  </span>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <FiRotateCcw className="text-white w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    30-Day Return
                  </span>
                  <span className="text-xs text-gray-600">
                    Easy returns policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description & Specs */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description & Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">
                Product Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description ||
                  "No description available for this product."}
              </p>
            </motion.div>

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">
                  Technical Specifications
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200"
                    >
                      <span className="font-bold text-gray-900">
                        {spec.key}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Vendor Info */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 md:p-8 h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">
              Seller Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Sold by</p>
                  <p className="font-bold text-gray-900">
                    {product.managedBy?.username || "Official Store"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Category</span>
                  <span className="font-bold text-gray-900">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Product ID</span>
                  <span className="font-mono text-sm text-gray-900">
                    {product._id?.slice(-8)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FiCheck className="w-5 h-5" />
                  <span className="font-semibold">Verified Seller</span>
                </div>
                <p className="text-sm text-gray-600">
                  This seller has been verified and approved by our team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
