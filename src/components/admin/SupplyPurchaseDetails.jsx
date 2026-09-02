import { useState, useEffect } from 'react';
import { FiShoppingCart, FiPackage, FiUsers, FiDollarSign, FiCalendar, FiArrowRight, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../utils/api";
import { formatRs } from "../../utils/currency";

const SupplyPurchaseDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  useEffect(() => {
    fetchSupplyPurchaseData();
  }, []);

  const fetchSupplyPurchaseData = async () => {
    try {
      const responseData = await api.get('/admin/supply-purchase');
      setData(responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => formatRs(amount);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Loading reports and analytics...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
      <FiInfo className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-red-800">Error Loading Data</h3>
      <p className="text-red-600 mt-2">{error}</p>
      <button
        onClick={fetchSupplyPurchaseData}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
      >
        Try Again
      </button>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
      <FiPackage className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-800">No Data Available</h3>
      <p className="text-slate-500 mt-2">There is no supply or purchase data to display yet.</p>
    </div>
  );

  const totalRevenue = data.orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg border border-blue-500 text-white flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <FiPackage className="w-7 h-7" />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Products</p>
            <h3 className="text-2xl font-bold">{data.products.length}</h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg border border-indigo-500 text-white flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <FiShoppingCart className="w-7 h-7" />
          </div>
          <div>
            <p className="text-indigo-100 text-sm font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold">{data.orders.length}</h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg border border-emerald-500 text-white flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <FiDollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'products'
            ? "bg-white text-blue-600 shadow-md"
            : "text-slate-600 hover:text-slate-800"
            }`}
        >
          <FiPackage className="w-4 h-4" />
          Product Supply
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'orders'
            ? "bg-white text-blue-600 shadow-md"
            : "text-slate-600 hover:text-slate-800"
            }`}
        >
          <FiShoppingCart className="w-4 h-4" />
          Purchase Orders
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {activeTab === 'products' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Managed By</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Added On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.products.map((product) => (
                    <motion.tr
                      key={product._id}
                      whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={getImageUrl(product.images[0])} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <FiPackage />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-700 font-bold">
                            {product.managedBy?.username?.[0] || 'A'}
                          </div>
                          {product.managedBy?.username || 'Admin'}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.quantity > 5
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}>
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${product.status === 'active' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-sm">
                        <div className="flex items-center justify-end gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {data.products.length === 0 && (
                <div className="py-20 text-center">
                  <FiPackage className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400">No products found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Qty</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.orders.map((order) => (
                    <motion.tr
                      key={order._id}
                      whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          #{order._id.slice(-6)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiUsers className="text-slate-400" />
                          <span className="font-semibold text-slate-800">{order.user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{order.product?.name || 'Deleted Product'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{order.quantity}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(order.price * order.quantity)}</td>
                      <td className="px-6 py-4 text-right text-slate-500 text-sm">
                        <div className="flex items-center justify-end gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatDate(order.date)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {data.orders.length === 0 && (
                <div className="py-20 text-center">
                  <FiShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400">No purchase orders found</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Analytics Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiPackage className="text-blue-600" />
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {data.orders.length > 0 ? (
              Object.entries(
                data.orders.reduce((acc, order) => {
                  const productName = order.product?.name || 'Unknown';
                  acc[productName] = (acc[productName] || 0) + order.quantity;
                  return acc;
                }, {})
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([name, quantity], idx) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="font-semibold text-slate-700">{name}</p>
                    </div>
                    <p className="text-slate-500 text-sm font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                      {quantity} sold
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-slate-400 text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Operations Summary</h3>
            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
              Your platform has processed <span className="text-white font-bold">{data.orders.length} orders</span> with a total volume of <span className="text-white font-bold">{formatCurrency(totalRevenue)}</span>. Keep track of stock levels to ensure smooth fulfillment.
            </p>
            <div className="flex items-center gap-2 text-indigo-300 group cursor-pointer hover:text-white transition-colors">
              <span className="text-sm font-bold">Download detailed report</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          {/* Abstract background shape */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SupplyPurchaseDetails;