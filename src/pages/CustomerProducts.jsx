import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCart } from "../context/CartContext";
import { productApi } from "../utils/api";
import { formatRs } from "../utils/currency";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiFilter,
  FiGrid,
  FiList,
  FiPackage,
  FiSearch,
  FiX,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the centralized API utility
        const response = await productApi.getAllProducts();
        const productsData = response.products || response || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "newest":
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
  };

  const filterProductsByPrice = (products, min, max) => {
    return products.filter((product) => {
      const price = product.price || 0;
      const minPrice = min ? parseInt(min) : 0;
      const maxPrice = max ? parseInt(max) : Infinity;
      return price >= minPrice && price <= maxPrice;
    });
  };

  const filterProductsByCategory = (products, category) => {
    if (category === "all") return products;
    return products.filter(
      (product) => (product.category || "").toLowerCase() === category.toLowerCase()
    );
  };

  const filteredAndSortedProducts = sortProducts(
    filterProductsByPrice(
      filterProductsByCategory(
        products.filter((p) => {
          if (!q) return true;
          const hay = `${p.name || ''} ${p.description || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase();
          return hay.includes(q);
        }),
        selectedCategory
      ),
      priceRange.min,
      priceRange.max
    ),
    sortBy
  );

  const  categories = [
    "Select Category",
    "Hair",
    "Skin Allergy",
    "Burn skin",
    "Body power up",
    "Weight gainer",
    "Heart cleaner",
    "Vitamin",
    "Other"
  ];

  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  const isProductNew = (product) => {
    if (!product.createdAt) return false;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(product.createdAt) > sevenDaysAgo;
  };

  const getDiscountPercentage = (product) => {
    if (!product.originalPrice || !product.price || product.originalPrice <= product.price) {
      return 0;
    }
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
  };

  const handleBuyNow = (product) => {
    if (!product || product.quantity === 0) return;
    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({ product, quantity: 1 })
    );
    navigate("/checkout", { state: { buyNow: true } });
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product._id);
    try {
      await addToCart(product._id, 1, product);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading products..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 font-semibold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {q ? 'Search Results' : 'All Products'}
              </h1>
              <p className="text-gray-600">
                {q ? (
                  <>Showing results for <span className="font-semibold text-blue-600">&ldquo;{q}&rdquo;</span></>
                ) : (
                  'Discover amazing products from our trusted vendors'
                )}
              </p>
            </div>
          </div>

          {/* Results Info Bar */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-2">
              <FiPackage className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">
                Showing <span className="font-bold text-blue-600">{filteredAndSortedProducts.length}</span> of <span className="font-bold">{products.length}</span> products
              </span>
            </div>
            {(selectedCategory !== "all" || priceRange.min || priceRange.max || sortBy !== "newest") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                <FiX className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-900 font-bold text-lg"
            >
              <FiFilter className="w-5 h-5 text-blue-600" />
              Filters & Sorting
              <FiChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">View:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === "list"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 font-medium"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all"
                            ? "All Categories"
                            : category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Min Price (Rs)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Max Price (Rs)</label>
                    <input
                      type="number"
                      placeholder="999999"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 font-medium"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 font-medium"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-16 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiSearch className="w-14 h-14 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
            {(selectedCategory !== "all" || priceRange.min || priceRange.max) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 font-semibold transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
            }`}>
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${viewMode === "list" ? "flex flex-row" : "flex flex-col"
                  }`}
              >
                {/* Product Image */}
                <Link
                  to={`/product/${product._id}`}
                  className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${viewMode === "list" ? "w-64 h-64 flex-shrink-0" : "w-full aspect-square"
                    }`}
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.quantity === 0 && (
                      <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-lg shadow-lg">
                        Out of Stock
                      </span>
                    )}
                    {getDiscountPercentage(product) > 0 && (
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg">
                        {getDiscountPercentage(product)}% OFF
                      </span>
                    )}
                    {isProductNew(product) && (
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg shadow-lg">
                        New
                      </span>
                    )}
                  </div>

                  {getProductImage(product) ? (
                    <img
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                        <span className="text-gray-400 text-sm font-medium">No Image</span>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                  <Link to={`/product/${product._id}`} className="group">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name || "Unnamed Product"}
                    </h3>
                  </Link>

                  {product.brand && (
                    <p className="text-sm text-gray-500 font-medium mb-3">{product.brand}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-4 h-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">4.0</span>
                    <span className="text-sm text-gray-400">(128)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatRs(product.price || 0)}
                    </span>
                    {getDiscountPercentage(product) > 0 && (
                      <span className="text-sm text-gray-400 line-through mb-1">
                        {formatRs(product.originalPrice || 0)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${product.quantity > 0
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                      {product.quantity > 0 ? (
                        <>
                          <FiCheck className="w-3.5 h-3.5" />
                          In Stock
                        </>
                      ) : (
                        <>
                          <FiX className="w-3.5 h-3.5" />
                          Out of Stock
                        </>
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.quantity === 0}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${product.quantity === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "cursor-pointer bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                        }`}
                    >
                      <FiPackage className="w-4 h-4" />
                      {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
                    </button>
                    <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0 || addingToCart === product._id}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${product.quantity === 0 || addingToCart === product._id
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                        }`}
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      {addingToCart === product._id ? (
                        "Adding..."
                      ) : product.quantity === 0 ? (
                        "Out of Stock"
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-md">
                      <FiHeart className="w-5 h-5" />
                    </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProducts;