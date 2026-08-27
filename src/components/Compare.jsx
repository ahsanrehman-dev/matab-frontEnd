import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import {
  FiSearch,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiPlus,
  FiTrash2,
  FiPackage,
  FiAlertCircle,
  FiCheck,
  FiFilter,
} from "react-icons/fi";

const Compare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [compareItems, setCompareItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (location.state?.productToCompare) {
      const product = location.state.productToCompare;
      if (!compareItems.find((item) => item._id === product._id)) {
        setCompareItems([product]);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/products");
        const products = response.products || [];
        const uniqueCategories = [
          ...new Set(products.map((p) => p.category)),
        ].filter(Boolean);
        setCategories(["all", ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const params = new URLSearchParams({ q: searchQuery, limit: 20 });
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }

        const response = await api.get(
          `/products/search-compare?${params}`
        );
        setSearchResults(response.products || []);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const addToCompare = (product) => {
    if (compareItems.length >= 4) {
      alert("You can compare up to 4 products at a time");
      return;
    }

    // Prevent duplicates
    if (compareItems.find((item) => item._id === product._id)) {
      alert("Product already added to comparison");
      return;
    }

    // Enforce category match
    if (compareItems.length > 0) {
      const existingCategory = compareItems[0].category;
      if (product.category !== existingCategory) {
        alert(
          `You can only compare products from the same category (${existingCategory}).`
        );
        return;
      }
    }

    setCompareItems((prev) => [...prev, product]);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const removeFromCompare = (id) => {
    setCompareItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all products?")) {
      setCompareItems([]);
    }
  };

  const getProductImage = (product) => {
    return product.images && product.images[0] ? product.images[0] : null;
  };

  const getAllSpecKeys = () => {
    const keys = new Set();
    compareItems.forEach((product) => {
      product.specifications?.forEach((spec) => keys.add(spec.key));
    });
    return Array.from(keys);
  };

  const getSpecValue = (product, key) => {
    const spec = product.specifications?.find((s) => s.key === key);
    return spec ? spec.value : "—";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1, product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await api.post("/user/wishlist", { productId });
      alert("Added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add to wishlist");
    }
  };

  const specKeys = getAllSpecKeys();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* Modern Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FiFilter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Product Comparison
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Compare up to 4 products side by side
                </p>
              </div>
            </div>
            {compareItems.length > 0 && (
              <button
                onClick={clearAll}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200/50"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Enhanced Search Section */}
        <div className="relative mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-5 md:p-7">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Search Products
                </h2>
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-semibold text-blue-600">
                      {compareItems.length}
                    </span>
                    <span>of 4 selected</span>
                  </span>
                </p>
              </div>
              {compareItems.length > 0 && (
                <button
                  onClick={clearAll}
                  className="md:hidden text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <FiFilter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by Category
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by product name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results Dropdown - Positioned absolutely outside parent */}
          {searchResults.length > 0 && (isSearchFocused || searchQuery) && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  {searchResults.length} Results Found
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer transition-all duration-200 group"
                    onClick={() => addToCompare(product)}
                  >
                    {getProductImage(product) ? (
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                        <FiPackage className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">
                        {product.brand && (
                          <span className="font-medium">{product.brand}</span>
                        )}
                        {product.brand && product.category && (
                          <span className="mx-1.5">•</span>
                        )}
                        {product.category && <span>{product.category}</span>}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${product.quantity > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {product.quantity > 0 ? (
                            <>
                              <FiCheck className="w-3 h-3" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <FiX className="w-3 h-3" />
                              Out of Stock
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                      </div>
                      <div className="w-10 h-10 bg-blue-600 group-hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors shadow-md">
                        <FiPlus className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {compareItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-12 md:p-20 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiSearch className="w-14 h-14 text-blue-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              No Products Selected
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto text-base leading-relaxed">
              Search and select products from the search bar above to start
              comparing features, specifications, and prices side by side
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b-2 border-gray-200">
                    <th className="w-64 p-6 text-left font-bold text-gray-900 sticky left-0 bg-gradient-to-r from-gray-50 to-blue-50/50 z-10">
                      <span className="text-base">Product Features</span>
                    </th>
                    {compareItems.map((product) => (
                      <th
                        key={product._id}
                        className="p-6 text-center min-w-[280px] relative group"
                      >
                        <button
                          onClick={() => removeFromCompare(product._id)}
                          className="absolute top-4 right-4 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 z-10"
                          title="Remove from comparison"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          {getProductImage(product) ? (
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-44 h-44 object-cover rounded-2xl mx-auto mb-4 shadow-lg ring-4 ring-gray-100 group-hover:ring-blue-200 transition-all"
                            />
                          ) : (
                            <div className="w-44 h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <FiPackage className="w-20 h-20 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 px-2 leading-snug">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-xs text-gray-500 mt-1 font-medium">
                            {product.brand}
                          </p>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-bold text-gray-900 sticky left-0 bg-white z-10">
                      <span className="flex items-center gap-2">Price</span>
                    </td>
                    {compareItems.map((product) => (
                      <td key={product._id} className="p-6 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <div className="flex flex-col items-center gap-1.5 mt-3">
                              <span className="text-sm text-gray-400 line-through font-medium">
                                {formatPrice(product.originalPrice)}
                              </span>
                              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                Save{" "}
                                {Math.round(
                                  ((product.originalPrice - product.price) /
                                    product.originalPrice) *
                                  100
                                )}
                                %
                              </span>
                            </div>
                          )}
                      </td>
                    ))}
                  </tr>

                  {/* Brand Row */}
                  <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-bold text-gray-900 sticky left-0 bg-white z-10">
                      Brand
                    </td>
                    {compareItems.map((product) => (
                      <td key={product._id} className="p-6 text-center">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-xl font-semibold text-sm border border-gray-200">
                          {product.brand || "Not specified"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Category Row */}
                  <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-bold text-gray-900 sticky left-0 bg-white z-10">
                      Category
                    </td>
                    {compareItems.map((product) => (
                      <td key={product._id} className="p-6 text-center">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Row */}
                  <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-bold text-gray-900 sticky left-0 bg-white z-10">
                      Availability
                    </td>
                    {compareItems.map((product) => (
                      <td key={product._id} className="p-6 text-center">
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
                              In Stock
                            </>
                          ) : (
                            <>
                              <FiX className="w-4 h-4" />
                              Out of Stock
                            </>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Specifications */}
                  {specKeys.map((key, index) => (
                    <tr
                      key={key}
                      className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? "bg-gray-50/40" : ""
                        }`}
                    >
                      <td className="p-6 font-bold text-gray-900 sticky left-0 bg-white z-10">
                        {key}
                      </td>
                      {compareItems.map((product) => (
                        <td
                          key={product._id}
                          className="p-6 text-center text-gray-700 font-medium"
                        >
                          {getSpecValue(product, key)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-bold text-gray-900 sticky left-0 bg-white z-10">
                      Discription
                    </td>
                    {compareItems.map((product) => (
                      <td key={product._id} className="p-6 text-center">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Actions Row */}
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50/50">
                    <td className="p-6 font-bold text-gray-900 sticky left-0 bg-gradient-to-r from-gray-50 to-blue-50/50 z-10">
                      Actions
                    </td>
                    {compareItems.map((product) => (
                      <td key={product._id} className="p-6">
                        <div className="space-y-3">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.quantity === 0}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${product.quantity === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                              }`}
                          >
                            <FiShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              to={`/product/${product._id}`}
                              className="flex items-center justify-center gap-2 py-3 px-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                              <FiEye className="w-4 h-4" />
                              View
                            </Link>
                            <button
                              onClick={() => handleAddToWishlist(product._id)}
                              className="flex items-center justify-center gap-2 py-3 px-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:border-red-400 hover:text-red-600 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                              <FiHeart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="text-center mt-8 bg-white/80 backdrop-blur-sm rounded-2xl py-5 px-6 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <FiAlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium">
              Prices and specifications are subject to change. Always verify
              details before making a purchase.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
