// pages/UserOrders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPackage,
    FiShoppingBag,
    FiTruck,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiX,
    FiMapPin,
    FiMail,
    FiPhone,
    FiCalendar,
    FiAlertCircle,
    FiArrowLeft,
    FiFilter,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const UserOrders = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            return;
        }
        fetchOrders();
    }, [isAuthenticated, navigate, filterStatus]);

    const getImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("data:")) return url;
        return `${process.env.Backend_Url}${url}`;
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = "/user/orders";
            if (filterStatus !== "all") {
                url += `?status=${filterStatus}`;
            }

            const data = await api.get(url);

            setOrders(data.orders || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                color: "bg-yellow-100 text-yellow-700 border-yellow-300",
                icon: FiClock,
                label: "Pending",
            },
            confirmed: {
                color: "bg-blue-100 text-blue-700 border-blue-300",
                icon: FiCheckCircle,
                label: "Confirmed",
            },
            processing: {
                color: "bg-purple-100 text-purple-700 border-purple-300",
                icon: FiPackage,
                label: "Processing",
            },
            shipped: {
                color: "bg-indigo-100 text-indigo-700 border-indigo-300",
                icon: FiTruck,
                label: "Shipped",
            },
            delivered: {
                color: "bg-green-100 text-green-700 border-green-300",
                icon: FiCheckCircle,
                label: "Delivered",
            },
            cancelled: {
                color: "bg-red-100 text-red-700 border-red-300",
                icon: FiXCircle,
                label: "Cancelled",
            },
        };
        return statusMap[status] || statusMap.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
                <p className="text-gray-700 font-semibold text-lg">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
                        <p className="text-red-700 mb-6">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(order => order.status === filterStatus);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                My Orders
                            </h1>
                            <p className="text-gray-600">
                                Track and manage your orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-4 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <FiFilter className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700 mr-2">Filter:</span>
                        {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${filterStatus === status
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-16 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FiShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {filterStatus === "all" ? "No Orders Yet" : `No ${filterStatus} Orders`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filterStatus === "all"
                                ? "Start shopping to create your first order"
                                : `You don't have any ${filterStatus} orders`}
                        </p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order, index) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                index={index}
                                onViewDetails={() => setSelectedOrder(order)}
                                getStatusInfo={getStatusInfo}
                            />
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                <AnimatePresence>
                    {selectedOrder && (
                        <OrderDetailsModal
                            order={selectedOrder}
                            onClose={() => setSelectedOrder(null)}
                            getStatusInfo={getStatusInfo}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Order Card Component
const OrderCard = ({ order, index, onViewDetails, getStatusInfo }) => {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all"
        >
            <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-gray-600">
                                Order #{order.orderNumber || order._id?.slice(-8)}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusInfo.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="text-left lg:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Rs {order.total?.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FiPackage className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700">
                            {order.items?.length} Item(s)
                        </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {order.items?.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex-shrink-0">
                                <img
                                    src={getImageUrl(item.product?.images?.[0]) || "/placeholder.jpg"}
                                    alt={item.product?.name || "Product"}
                                    className="w-16 h-16 object-cover rounded-lg bg-gray-100 border border-gray-200"
                                />
                            </div>
                        ))}
                        {order.items?.length > 4 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                <span className="text-xs font-bold text-gray-600">
                                    +{order.items.length - 4}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onViewDetails}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                        <FiEye className="w-4 h-4" />
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, getStatusInfo }) => {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-600">
                            Order #{order.orderNumber || order._id?.slice(-8)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Status Timeline */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                        <div className="flex items-center gap-3 mb-4">
                            <StatusIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">Current Status</h3>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-bold border ${statusInfo.color}`}>
                            <StatusIcon className="w-5 h-5" />
                            {statusInfo.label}
                        </div>
                        {order.status === "shipped" && (
                            <p className="text-sm text-gray-600 mt-3">
                                Estimated delivery: 2-3 working days
                            </p>
                        )}
                    </div>

                    {/* Order Date & Payment */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                Order Date
                            </p>
                            <p className="font-semibold text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                            <p className="font-semibold text-gray-900 capitalize">
                                {order.paymentMethod?.replace("_", " ") || "Cash on Delivery"}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMapPin className="w-5 h-5 text-green-600" />
                            Shipping Address
                        </h3>
                        <div className="space-y-2 text-gray-700">
                            <p className="font-semibold text-gray-900">
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                            </p>
                            <p className="flex items-center gap-2">
                                <FiMail className="w-4 h-4" />
                                {order.shippingAddress?.email}
                            </p>
                            <p className="flex items-center gap-2">
                                <FiPhone className="w-4 h-4" />
                                {order.shippingAddress?.phone}
                            </p>
                            <p className="flex items-start gap-2">
                                <FiMapPin className="w-4 h-4 mt-1" />
                                <span>
                                    {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                                    <img
                                        src={getImageUrl(item.product?.images?.[0]) || "/placeholder.jpg"}
                                        alt={item.product?.name || "Product"}
                                        className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {item.product?.name || "Product"}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Quantity: {item.quantity}
                                        </p>
                                        <p className="font-bold text-green-600">
                                            Rs {item.price?.toLocaleString()} × {item.quantity} = Rs{" "}
                                            {(item.total || item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal:</span>
                                <span className="font-semibold">Rs {order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping:</span>
                                <span className="font-semibold">
                                    {order.shippingCost === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `Rs ${order.shippingCost}`
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax (5%):</span>
                                <span className="font-semibold">Rs {order.tax?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Rs {order.total?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <h4 className="font-semibold text-gray-900 mb-2">Your Notes:</h4>
                            <p className="text-gray-700">{order.notes}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserOrders;