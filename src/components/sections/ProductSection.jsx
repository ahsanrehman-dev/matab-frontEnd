import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useCart } from "../../context/CartContext";
import { formatRs } from "../../utils/currency";
import {
  FiArrowRight,
  FiChevronRight,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiBarChart2,
  FiStar
} from "react-icons/fi";

const ProductSection = ({
  title,
  subtitle,
  products,
  emptyMessage = "No products found in this category",
  emptyIcon = "📦",
  showViewAll,
  viewAllLink,
  sectionIcon,
  sectionColor = "from-blue-500 to-purple-500",
  loading = false
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
        ease: "easeOut"
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
  };

  // Loading state - more compact
  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mb-1"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state - more compact
  if (!products || products.length === 0) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {sectionIcon && (
              <div className={`w-8 h-8 bg-gradient-to-r ${sectionColor} rounded-lg flex items-center justify-center`}>
                {sectionIcon}
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-4">{emptyIcon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600 text-sm mb-6">Check back soon for new products</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Browse All Products</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  // Show 6 products for better grid layout
  const displayedProducts = products.slice(0, 6);
  const hasMoreProducts = products.length > 6;

  return (
    <motion.section
      className="py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Compact Section Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.div className="flex items-center space-x-3" variants={itemVariants}>
          {sectionIcon && (
            <div className={`w-8 h-8 bg-gradient-to-r ${sectionColor} rounded-lg flex items-center justify-center shadow-sm`}>
              {sectionIcon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
            )}
          </div>
        </motion.div>

        {/* View All Link */}
        {(showViewAll || hasMoreProducts) && (
          <motion.div variants={itemVariants}>
            <Link
              to={viewAllLink}
              className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 group"
            >
              <span>View All</span>
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Product grid — 4 columns so cards and hover icons have room */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product._id || product.id || index}
            variants={itemVariants}
            className="group"
          >
            <EnhancedCompactProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Show more products indicator */}
      {hasMoreProducts && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to={viewAllLink}
            className="inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 group"
          >
            <span>View All {products.length} Products</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
};

// Enhanced Compact Product Card with all ProductCard functionality
const EnhancedCompactProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const formatPrice = (price) => formatRs(price);

  // Get rating stars like in ProductCard
  const getRatingStars = (rating = product.rating || 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          className="w-3 h-3 text-yellow-400 fill-current"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          className="w-3 h-3 text-yellow-400 fill-current opacity-70"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar
          key={`empty-${i}`}
          className="w-3 h-3 text-gray-300"
        />
      );
    }

    return stars;
  };

  // Check if product is new (within 7 days)
  const isNewProduct = () => {
    if (!product.createdAt) return false;
    return new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  };

  // Action handlers from ProductCard
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1, product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist toggled:", product.name);
    // Add your wishlist logic here
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Quick view:", product.name);
    // Add your quick view modal logic here
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/compare', { state: { productToCompare: product } });
  };

  const hoverEase = "ease-[cubic-bezier(0.33,0,0.2,1)]";
  const actionBtnClass =
    `w-8 h-8 shrink-0 flex items-center justify-center rounded-full shadow-lg bg-white/95 text-gray-900 backdrop-blur-sm opacity-0 translate-x-5 pointer-events-none cursor-pointer group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto hover:scale-110 hover:shadow-xl hover:delay-0 active:scale-95 transition-all duration-400 ${hoverEase} delay-0`;

  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="block group h-full"
    >
      <div className={`bg-white rounded-xl border border-gray-100 relative h-full flex flex-col transition-shadow duration-300 ${hoverEase} group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]`}>

        {/* Product Image */}
        <div className="aspect-square bg-gray-50 overflow-hidden relative rounded-t-xl">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-3"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-2xl">📦</div>
            </div>
          )}

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
            {isNewProduct() && (
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
              onClick={handleWishlist}
              className={`${actionBtnClass} group-hover:delay-[0ms] ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "hover:bg-red-500 hover:text-white"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiHeart className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className={`${actionBtnClass} group-hover:delay-[70ms] hover:bg-blue-600 hover:text-white`}
              title="Add to Cart"
            >
              <FiShoppingCart className="w-4 h-4" />
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
        <div className="p-3 flex-1 flex flex-col gap-1">
          {product.category && (
            <p className="text-[11px] text-gray-500 uppercase tracking-wide truncate">
              {product.category}
              {product.brand ? ` · ${product.brand}` : ""}
            </p>
          )}

          <h3 className={`text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-500 ${hoverEase}`}>
            {product.name}
          </h3>

          {(product.rating || product.rating === 0) && (
            <div className="flex items-center gap-1">
              <div className="flex items-center shrink-0">
                {getRatingStars()}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          <div className="flex items-baseline justify-between gap-2 mt-auto">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-sm font-semibold text-blue-600 truncate">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through shrink-0">
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
        </div>
      </div>
    </Link>
  );
};

// PropTypes validation
ProductSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  products: PropTypes.array,
  emptyMessage: PropTypes.string,
  emptyIcon: PropTypes.string,
  showViewAll: PropTypes.bool,
  viewAllLink: PropTypes.string,
  sectionIcon: PropTypes.element,
  sectionColor: PropTypes.string,
  loading: PropTypes.bool,
};

EnhancedCompactProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductSection;