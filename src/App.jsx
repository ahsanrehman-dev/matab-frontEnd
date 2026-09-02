import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ResponsiveFooter from "./components/ResponsiveFooter";
import ResponsiveSidebar from "./components/ResponsiveSidebar";
import UserProfile from "./pages/UserProfile";
import ProductDetails from "./components/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import NewArrivals from "./pages/NewArrivals";
import TodayDeals from "./pages/TodayDeals";
import CustomerProducts from "./pages/CustomerProducts";
import NotFound from "./components/NotFound";
import Favorites from "./components/user/Favorites";
import Cart from "./components/user/Cart";
import Wishlist from "./components/user/Wishlist";
import "./Styles/App.css";
import "./components/MainContent.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Compare from "./components/Compare";
import Checkout from "./pages/Checkout";
import UserOrderHistory from "./pages/userOrders";
import Navbar from "./components/Navbar";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showNavbar =
    !location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/admin");

  return (
    <>
      {showNavbar && (
        <>
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <ResponsiveSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </>
      )}
      <main className="main-content">{children}</main>
      {showNavbar && <ResponsiveFooter />}
    </>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const adminLoggedIn = isAuthenticated && isAdmin;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route
        path="/verify-email"
        element={<Navigate to="/admin/verify-email" replace />}
      />
      <Route
        path="/forgot-password"
        element={<Navigate to="/admin/forgot-password" replace />}
      />
      <Route
        path="/admin"
        element={
          adminLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/admin/login"
        element={
          adminLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/admin/register"
        element={
          adminLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />
      <Route
        path="/admin/verify-email"
        element={
          adminLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <VerifyEmail />
          )
        }
      />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          adminLoggedIn ? <Dashboard /> : <Navigate to="/admin/login" replace />
        }
      />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route
        path="/edit-profile/:id"
        element={
          adminLoggedIn ? (
            <Layout>
              <UserProfile />
            </Layout>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      {/* User-specific Routes */}
      <Route
        path="/favorites"
        element={
          <Layout>
            <Favorites />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <Layout>
            <Wishlist />
          </Layout>
        }
      />

      <Route
        path="/compare"
        element={
          <Layout>
            <Compare />
          </Layout>
        }
      />
      <Route
        path="/orders"
        element={
          <Layout>
            <UserOrderHistory />
          </Layout>
        }
      />

      {/* Product Routes */}
      <Route
        path="/product/:productId"
        element={
          <Layout>
            <ProductDetails />
          </Layout>
        }
      />

      <Route
        path="/checkout"
        element={
          <Layout>
            <Checkout />
          </Layout>
        }
      />
      {/* Customer Products Route */}
      <Route
        path="/products"
        element={
          <Layout>
            <CustomerProducts />
          </Layout>
        }
      />

      {/* Category Routes */}
      <Route
        path="/category/:category"
        element={
          <Layout>
            <CategoryPage />
          </Layout>
        }
      />

      {/* Navigation Routes */}
      <Route
        path="/new-arrivals"
        element={
          <Layout>
            <NewArrivals />
          </Layout>
        }
      />
      <Route
        path="/todays-deal"
        element={
          <Layout>
            <TodayDeals />
          </Layout>
        }
      />

      {/* Specific Category Routes */}
      <Route
        path="/home-appliances"
        element={<Navigate to="/category/home-appliances" replace />}
      />
      <Route
        path="/audio-video"
        element={<Navigate to="/category/audio-video" replace />}
      />
      <Route
        path="/refrigerator"
        element={<Navigate to="/category/refrigerator" replace />}
      />
      <Route
        path="/gift-cards"
        element={<Navigate to="/category/gift-cards" replace />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
);

// Layout component expects children prop

export default App;
