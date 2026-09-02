import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiStar,
  FiEye,
  FiShoppingCart,
  FiArrowRight,
  FiZap,
  FiPackage,
  FiRefreshCw,
  FiChevronRight,
  FiHeart,
  FiBarChart2
} from "react-icons/fi";
import HeroSection from "../components/sections/heroSection";
import ProductSection from "../components/sections/ProductSection";
import EmptyState from "../components/sections/EmptyState";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { formatRs } from "../utils/currency";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminWhatsApp = "923191997277";

  // ✅ WhatsApp handler
  const handleWhatsAppChat = () => {
    const message = encodeURIComponent("Hello Admin, I need help!");
    const whatsappURL = `https://wa.me/${adminWhatsApp}?text=${message}`;
    window.open(whatsappURL, "_blank");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get("/products");
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);




  // Helper functions to filter products
  const getNewArrivals = () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return products
      .filter((product) => new Date(product.createdAt) > oneWeekAgo)
      .slice(0, 8);
  };

  const getTrendingProducts = () => {
    return [...products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8);
  };

  const getProductsByCategory = (category) => {
    return products.filter(
      (product) => product.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured === true).slice(0, 8);
  };

  const getBestSellers = () => {
    return [...products]
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 8);
  };

  const getElectronicsProducts = () => {
    const HairCategories = [
      "Hair Fall",
      "Dandruff",
      "Hair Growth",
      "Dry Hair",
      "Grey Hair",
      "Split Ends",
    ];
    return products.filter((product) =>
      HairCategories.includes(product.category?.toLowerCase())
    ).slice(0, 8);
  };

  const getHomeAppliancesProducts = () => {
    const BurnSkinCategories = [
      "Sunburn",
      "Chemical Burn",
      "Heat Burn",
      "First Degree Burn",
      "Second Degree Burn",
      "Burn Ointments",
    ];
    return products.filter((product) =>
      BurnSkinCategories.includes(product.category?.toLowerCase())
    ).slice(0, 8);
  };

  const getUniqueCategories = () => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ].filter(Boolean);
    return categories.sort((a, b) => a.localeCompare(b));
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-280px)]">
        <LoadingSpinner text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <FiRefreshCw className="w-12 h-12 text-red-500" />
          </div>
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-600 text-lg">{error}</p>
            <p className="text-sm text-gray-500">
              Don&apos;t worry, our team has been notified and we&apos;re working to fix this issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 
                       transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate all product sections
  const newArrivals = getNewArrivals();
  const trendingProducts = getTrendingProducts();
  const featuredProducts = getFeaturedProducts();
  const bestSellers = getBestSellers();
  const electronicsProducts = getElectronicsProducts();
  const homeAppliancesProducts = getHomeAppliancesProducts();
  const categories = getUniqueCategories();

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Quick Stats Bar - More compact */}
        <section className="py-8 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{products.length}+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{categories.length}+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers - Clean White Background */}
        {bestSellers.length > 0 && (
          <CleanProductSection
            title="Best Sellers"
            subtitle="Top-rated products by our customers"
            products={bestSellers}
            showViewAll={true}
            viewAllLink="/products?sort=bestselling"
            icon={<FiStar className="w-5 h-5 text-yellow-500" />}
          />
        )}

        {/* Latest Electronics - Prominent Background */}
        {electronicsProducts.length > 0 && (
          <ProminentProductSection
            title="Latest Electronics"
            subtitle="Discover cutting-edge technology"
            products={electronicsProducts}
            bgColor="from-blue-600 to-blue-800"
            viewAllLink="/category/electronics"
          />
        )}

        {/* New Arrivals - Clean White Background */}
        <CleanProductSection
          title="New Arrivals"
          subtitle="Fresh products just added to our collection"
          products={newArrivals}
          showViewAll={true}
          viewAllLink="/new-arrivals"
          icon={<FiZap className="w-5 h-5 text-green-500" />}
        />

        {/* Home Appliances - Prominent Background */}
        {homeAppliancesProducts.length > 0 && (
          <ProminentProductSection
            title="Home Appliances"
            subtitle="Smart solutions for modern homes"
            products={homeAppliancesProducts}
            bgColor="from-purple-600 to-purple-800"
            viewAllLink="/category/home-appliances"
          />
        )}

        {/* Trending Now - Clean White Background */}
        <CleanProductSection
          title="Trending Now"
          subtitle="Most popular products this week"
          products={trendingProducts}
          showViewAll={true}
          viewAllLink="/products?sort=trending"
          icon={<FiTrendingUp className="w-5 h-5 text-red-500" />}
        />

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <CleanProductSection
            title="Featured Products"
            subtitle="Handpicked by our team"
            products={featuredProducts}
            showViewAll={true}
            viewAllLink="/products?featured=true"
            icon={<FiStar className="w-5 h-5 text-yellow-500" />}
          />
        )}

        {/* Category Sections - Using your original ProductSection component */}
        <div className="chking">
          {categories.slice(0, 6).map((category) => (
            <ProductSection
              key={category}
              title={category}
              subtitle={`Best ${category.toLowerCase()} products for you`}
              products={getProductsByCategory(category)}
              loading={loading}
              showViewAll={getProductsByCategory(category).length > 6}
              viewAllLink={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
            />
          ))}
        </div>

        {/* View All Categories */}
        {categories.length > 6 && (
          <div className="text-center mt-12 pb-8">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiPackage className="w-5 h-5" />
              <span>Explore All Categories</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <section className="py-12">
            <EmptyState
              title="No Products Available Yet"
              message="We&apos;re working hard to bring you amazing products. Our vendors are setting up their stores!"
              icon="🏪"
              showButton={false}
              size="default"
            />
          </section>
        )}
      </div>
      <button
        onClick={handleWhatsAppChat}
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-xl flex items-center justify-center transition transform hover:scale-110 z-50"
        title="Chat with Admin"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-8 h-8"
        />
      </button>
    </motion.div>
  );
};

// Clean White Section Component
const CleanProductSection = ({ title, subtitle, products, showViewAll, viewAllLink, icon }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">{subtitle}</p>
            </div>
          </div>
          {showViewAll && (
            <Link
              to={viewAllLink}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <span>View All</span>
              <FiChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <EnhancedProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Prominent Background Section Component
const ProminentProductSection = ({ title, subtitle, products, bgColor, viewAllLink }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8">
      <div className={`bg-gradient-to-r ${bgColor} rounded-2xl p-8 text-white shadow-lg`}>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-blue-100 mt-1">{subtitle}</p>
          </div>
          <Link
            to={viewAllLink}
            className="flex items-center space-x-2 text-white hover:text-blue-100 font-medium transition-colors"
          >
            <span>View All</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <EnhancedProductCard key={product._id} product={product} isDark={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Product Card with Full Functionality
const hoverEase = "ease-[cubic-bezier(0.33,0,0.2,1)]";

const EnhancedProductCard = ({ product, isDark = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  const cardBg = isDark ? "bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20" : "bg-white border-gray-200";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subtextColor = isDark ? "text-blue-100" : "text-gray-600";

  const formatPrice = (price) => formatRs(price);

  // Get rating stars
  const getRatingStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          className="w-4 h-4 text-yellow-400 fill-current opacity-70"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
        />
      );
    }

    return stars;
  };

  // Action handlers with API calls
  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.quantity || product.quantity <= 0) return;
    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({ product, quantity: 1 })
    );
    navigate("/checkout", { state: { buyNow: true } });
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product._id, 1, product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/wishlist');
        return;
      }

      if (isWishlisted) {
        // Remove from wishlist
        await api.delete(`/user/wishlist/${product._id}`);
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        await api.post("/user/wishlist", {
          productId: product._id
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view modal
    console.log("Quick view:", product.name);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/compare', { state: { productToCompare: product } });
  };

  const actionBtnClass =
    `w-9 h-9 shrink-0 flex items-center justify-center rounded-full shadow-lg bg-white/95 text-gray-900 backdrop-blur-sm opacity-0 translate-x-5 pointer-events-none cursor-pointer group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto hover:scale-110 hover:shadow-xl hover:delay-0 active:scale-95 transition-all duration-400 ${hoverEase} delay-0`;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block h-full"
    >
      <div className={`${cardBg} border rounded-xl relative h-full flex flex-col transition-shadow duration-300 ${hoverEase} group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]`}>

        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden relative">
          {product.images && product.images.length > 0 ? (
            <img
              src={getImageUrl(product.images[0])}
              alt={product.name}
              className="w-full h-full object-contain p-3"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiPackage className="w-8 h-8" />
            </div>
          )}

          {/* Status badges stay on the left so they never cover hover actions */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.status === "revoked" && (
              <div className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
                Unavailable
              </div>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            )}
            {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <div className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-md">
                New
              </div>
            )}
          </div>

          <div
            className={`absolute inset-0 bg-gradient-to-l from-black/20 via-black/[0.04] to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-400 ${hoverEase}`}
          />
          <div className="absolute top-1/2 right-2 z-20 -translate-y-1/2 flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              className={`${actionBtnClass} group-hover:delay-[0ms] hover:bg-blue-600 hover:text-white`}
              title="Add to Cart"
            >
              <FiShoppingCart className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToWishlist}
              className={`${actionBtnClass} group-hover:delay-[70ms] ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "hover:bg-red-500 hover:text-white"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiHeart className="w-4 h-4" />
            </button>
            <button
              onClick={handleQuickView}
              className={`${actionBtnClass} group-hover:delay-[140ms] hover:bg-green-500 hover:text-white`}
              title="Quick View"
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={handleCompare}
              className={`${actionBtnClass} group-hover:delay-[210ms] hover:bg-purple-500 hover:text-white`}
              title="Compare"
            >
              <FiBarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col gap-1.5">
          {product.category && (
            <p className={`text-[11px] ${subtextColor} uppercase tracking-wide truncate`}>
              {product.category}
              {product.brand ? ` · ${product.brand}` : ""}
            </p>
          )}

          <h3 className={`font-medium ${textColor} line-clamp-2 group-hover:text-blue-600 transition-colors duration-500 ${hoverEase} text-sm leading-snug min-h-[2.5rem]`}>
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-auto">
            <div className="flex shrink-0">{getRatingStars()}</div>
            <span className={`text-xs ${subtextColor}`}>(4.5)</span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className={`font-bold ${textColor} text-base truncate`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={`text-xs ${subtextColor} line-through shrink-0`}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.quantity > 0 ? (
              <span className="text-[11px] text-green-600 font-medium shrink-0">{product.quantity} left</span>
            ) : (
              <span className="text-[11px] text-red-500 font-medium shrink-0">Out of stock</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.quantity || product.quantity <= 0}
            className={`w-full mt-1 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${hoverEase} ${
              !product.quantity || product.quantity <= 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
};

// PropTypes validation
CleanProductSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  showViewAll: PropTypes.bool.isRequired,
  viewAllLink: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

ProminentProductSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  bgColor: PropTypes.string.isRequired,
  viewAllLink: PropTypes.string.isRequired,
};

EnhancedProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  isDark: PropTypes.bool,
};

export default Home;