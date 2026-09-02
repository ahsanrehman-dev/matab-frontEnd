import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiPackage } from "react-icons/fi";
import ProductEditForm from "./ProductEditForm";
import "./ProductList.css";
import PropTypes from "prop-types";
import api from "../../utils/api";
import { formatRs } from "../../utils/currency";

const ProductList = forwardRef(({ onAddProduct }, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      // Use the api utility which handles headers and base URL
      const data = await api.get("/admin/products");
      // The api utility returns the response data directly (handled by handleResponse)
      // Assuming api.get returns the parsed JSON. The original code expected array or object.
      // If api.js handleResponse returns response.json(), then `data` is the object.
      // Check if backend returns array or { products: [...] } or just [...]
      // Looking at original code: setProducts(data). So backend returns array?
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchProducts,
  }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/admin/products/${productId}`);

      // Remove from local state
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const saveEdit = async (productId, updatedData) => {
    try {
      const updatedProduct = await api.put(
        `/admin/products/${productId}`,
        updatedData
      );

      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? updatedProduct.product : product
        )
      );
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Removed product click functionality - vendors should not navigate to product details
  // This functionality is for customers only

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: '500' }}>Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="error-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ color: '#ef4444', marginBottom: '1rem' }}>Error: {error}</div>
      <button className="btn-primary" onClick={fetchProducts}>Try Again</button>
    </div>
  );

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="empty-state">
          <FiEye size={48} />
          <h3>No products yet</h3>
          <p>Start by adding your first product to your catalog.</p>
          {onAddProduct && (
            <button className="btn-primary" onClick={onAddProduct}>
              <FiPlus /> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images[0] ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                  />
                ) : (
                  <div className="placeholder-image">
                    <FiPackage size={32} />
                    <span>No Image</span>
                  </div>
                )}
                <div className="product-status">
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </div>
              </div>

              {editingProduct && editingProduct._id === product._id ? (
                <ProductEditForm
                  product={product}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                />
              ) : (
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>

                  <div className="product-info-row">
                    <div className="price-tag">
                      <span className="price-label">Price</span>
                      <span className="price-value">{formatRs(product.price)}</span>
                    </div>
                    <div className="stock-tag">
                      <span className="stock-label">Stock</span>
                      <span className={`stock-value ${product.quantity < 10 ? 'low' : ''}`}>
                        {product.quantity} units
                      </span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-edit"
                      onClick={() => startEdit(product)}
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteProduct(product._id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ProductList.propTypes = {
  onAddProduct: PropTypes.func,
};

ProductList.displayName = "ProductList";

export default ProductList;
