import { useState, useEffect } from "react";
import {
  FiPackage,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import api, { adminApi } from "../../utils/api";

const ProductModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const revokeProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to revoke this product?")) {
      return;
    }

    try {
      await api.put(`/admin/products/${productId}/revoke`);

      // Update local state
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, status: "revoked" }
            : product
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const reactivateProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to reactivate this product?")) {
      return;
    }

    try {
      await api.put(`/admin/products/${productId}/reactivate`);

      // Update local state
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, status: "active" } : product
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return <div className="loading">Loading products for moderation...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-moderation">
      <div className="page-header">
        <h2>Product Moderation</h2>
        <p>Review and manage products uploaded by vendors</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products or vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="moderation-stats">
        <div className="stat-item">
          <FiPackage />
          <span>Total Products: {products.length}</span>
        </div>
        <div className="stat-item">
          <FiCheck />
          <span>
            Active: {products.filter((p) => p.status === "active").length}
          </span>
        </div>
        <div className="stat-item">
          <FiX />
          <span>
            Revoked: {products.filter((p) => p.status === "revoked").length}
          </span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={48} />
          <p>No products found</p>
          {searchTerm && <p>Try adjusting your search terms</p>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-slate-200 mt-6">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide">
                  Product
                </th>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide">
                  Vendor
                </th>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide">
                  Price (PKR)
                </th>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide">
                  Stock
                </th>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide">
                  Added Date
                </th>
                <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wide text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50 transition-all duration-150"
                >
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {product.vendor?.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.vendor?.email}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    PKR {product.price.toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${product.quantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {product.quantity > 0
                        ? `${product.quantity}`
                        : "Out of stock"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : product.status === "revoked"
                            ? "bg-red-100 text-red-700"
                            : product.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* Added Date */}
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(product.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {/* View */}
                      <button
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        title="View Details"
                      >
                        <FiEye />
                      </button>

                      {/* Revoke / Reactivate */}
                      {product.status === "active" ? (
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          onClick={() => revokeProduct(product._id)}
                          title="Revoke Product"
                        >
                          <FiX />
                        </button>
                      ) : (
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                          onClick={() => reactivateProduct(product._id)}
                          title="Reactivate Product"
                        >
                          <FiCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Moderation Guidelines */}
      <div className="moderation-guidelines">
        <h3>Moderation Guidelines</h3>
        <div className="guidelines-content">
          <div className="guideline-item">
            <FiAlertTriangle />
            <div>
              <h4>When to Revoke a Product</h4>
              <ul>
                <li>Inappropriate or offensive content</li>
                <li>Counterfeit or illegal items</li>
                <li>Misleading product descriptions</li>
                <li>Violation of platform policies</li>
              </ul>
            </div>
          </div>
          <div className="guideline-item">
            <FiCheck />
            <div>
              <h4>When to Reactivate</h4>
              <ul>
                <li>Content has been corrected</li>
                <li>Policy violation resolved</li>
                <li>False positive review</li>
                <li>Vendor has appealed successfully</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModeration;
