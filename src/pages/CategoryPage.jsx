import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import {
  FiFilter,
  FiGrid,
  FiList,
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiEye,
} from "react-icons/fi";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/category/${category}`);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const getCategoryDisplayName = (categorySlug) => {
    const categoryMap = {
      "Select Catrgory": "Select Catrgory",
      "hair": "Hair",
      "skin-allergy": "Skin Allergy",
      "burn-skin": "Burn Skin",
      "body-power-up": "Body Power Up",
      "weight-gainer": "Weight Gainer",
      "heart-cleaner": "Heart Cleaner",
      "other": "Other",
    };
    return (
      categoryMap[categorySlug] ||
      categorySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];

    switch (sortBy) {
      case "price-low":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  const filterProductsByPrice = (products, min, max) => {
    if (!min && !max) return products;

    return products.filter((product) => {
      const price = product.price;
      const minPrice = min ? parseFloat(min) : 0;
      const maxPrice = max ? parseFloat(max) : Infinity;

      return price >= minPrice && price <= maxPrice;
    });
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  const filteredAndSortedProducts = sortProducts(
    filterProductsByPrice(products, priceRange.min, priceRange.max),
    sortBy
  );

  if (loading) return <LoadingSpinner fullScreen text="Loading products..." />;

  if (error) {
    return (
      <div className="category-page">
        <div className="error-container">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <Link to="/" className="btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Header */}
      <div className="category-header">
        <div className="category-info">
          <h1>{getCategoryDisplayName(category)}</h1>
          <p>{filteredAndSortedProducts.length} products found</p>
        </div>

        <div className="category-controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <FiGrid />
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <FiList />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="category-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>
              <FiFilter /> Filters
            </h3>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="price-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Brand</label>
              <div className="brand-filters">
                {Array.from(
                  new Set(products.map((p) => p.brand).filter(Boolean))
                ).map((brand) => (
                  <label key={brand} className="checkbox-label">
                    <input type="checkbox" />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid/List */}
        <main className="products-section">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or browse other categories.</p>
            </div>
          ) : (
            <div className={`products-container ${viewMode}`}>
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/product/${product._id}`} className="product-link">
                    <div className="product-image">
                      <img
                        src={getImageUrl(product.images?.[0]) || "/placeholder-product.jpg"}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                      <div className="product-overlay">
                        <FiEye />
                      </div>
                    </div>

                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>
                      {product.brand && (
                        <p className="product-brand">{product.brand}</p>
                      )}

                      <div className="product-rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={star <= 4 ? "filled" : ""}
                            />
                          ))}
                        </div>
                        <span>(4.0)</span>
                      </div>

                      <div className="product-price">
                        <span className="current-price">
                          PKR {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="original-price">
                              PKR {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                      </div>

                      <div className="product-stock">
                        <span
                          className={`stock-badge ${product.quantity > 0 ? "in-stock" : "out-of-stock"
                            }`}
                        >
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="product-actions">
                    <button
                      className="btn add-to-cart cursor-pointer"
                      onClick={() => addToCart(product._id, 1, product)}
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button className="btn-secondary wishlist">
                      <FiHeart />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
