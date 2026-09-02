import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  // FiTrendingUp,
  FiLogOut,
  FiHome,
  FiMenu,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboardStats from "./AdminDashboardStats";
import UserList from "./UserList";

import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import SupplyPurchaseDetails from "./SupplyPurchaseDetails";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [showProductForm, setShowProductForm] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "products", label: "Product Management", icon: FiShoppingCart },
    { id: "orders", label: "Orders & Supply", icon: FiPackage },
    // { id: "analytics", label: "Analytics", icon: FiTrendingUp },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminDashboardStats />;
      case "users":
        return <UserList />;

      case "products":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">
                {showProductForm ? "Add New Product" : "Manage Products"}
              </h2>
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showProductForm
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  }`}
              >
                {showProductForm ? (
                  <>
                    <FiShoppingCart /> View All
                  </>
                ) : (
                  <>
                    <FiPlus /> Add Product
                  </>
                )}
              </button>
            </div>
            {showProductForm ? (
              <ProductForm onProductAdded={() => setShowProductForm(false)} />
            ) : (
              <ProductList onAddProduct={() => setShowProductForm(true)} />
            )}
          </div>
        );
      case "orders":
        return <SupplyPurchaseDetails />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">


      {/* SIDEBAR (desktop always visible, mobile toggleable) */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 288 : 0,
          x: (window.innerWidth < 768 && !sidebarOpen) ? -288 : 0,
          opacity: (window.innerWidth < 768 && !sidebarOpen) ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
        className="fixed md:static inset-y-0 left-0 bg-slate-900 text-slate-300 shadow-2xl z-50 
                   flex flex-col transform md:translate-x-0 border-r border-slate-800 overflow-hidden"
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FiHome className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">E-Process</h2>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation Area */}
        <div className="flex-grow overflow-y-auto py-6 px-4 custom-scrollbar">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 px-2">Main Menu</p>
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${isActive
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                    : "hover:bg-slate-800 hover:text-white"
                    }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span className="text-sm font-semibold tracking-wide">{tab.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="w-1.5 h-1.5 rounded-full bg-white shadow-glow"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-blue-500/30 overflow-hidden">
              {user?.username ? (
                <span className="text-lg font-bold text-blue-400">{user.username.charAt(0).toUpperCase()}</span>
              ) : (
                <FiUsers className="text-slate-400" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">{user?.username || "Admin"}</p>
              <p className="text-[11px] text-slate-400 truncate tracking-wide">{user?.email || "admin@example.com"}</p>
            </div>
          </div>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 shadow-lg shadow-red-500/5"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </div>
      </motion.aside>

      {/* OVERLAY (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow min-w-0 h-screen overflow-y-auto custom-scrollbar relative">
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-extrabold text-slate-800 capitalize tracking-tight">
              {activeTab} <span className="text-slate-400 font-medium text-sm ml-2">/ Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800 leading-none">{user?.username || "Admin"}</span>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold mt-1">Super Admin</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300/50 flex items-center justify-center text-slate-600 font-bold shadow-inner">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
