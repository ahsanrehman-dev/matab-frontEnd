import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { cartApi, productApi } from '../utils/api';

const GUEST_CART_KEY = 'guestCart';

const snapshotProduct = (product) => {
  if (!product || typeof product !== 'object') return null;
  return {
    _id: product._id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images,
    quantity: product.quantity,
    category: product.category,
  };
};

const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const extractApiItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const normalizeItem = (item) => {
  const nestedProduct =
    item.product && typeof item.product === 'object'
      ? item.product
      : item.productId && typeof item.productId === 'object'
        ? item.productId
        : null;
  const productId =
    nestedProduct?._id ||
    (typeof item.productId === 'string' ? item.productId : null) ||
    item._id;

  return {
    _id: item._id || productId,
    productId,
    quantity: item.quantity || 1,
    product: snapshotProduct(nestedProduct),
  };
};

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const setCartState = (items) => {
    const normalized = items.map(normalizeItem);
    setCartItems(normalized);
    setCartCount(normalized.length);
  };

  const hydrateGuestProducts = async (items) => {
    const hydrated = await Promise.all(
      items.map(async (item) => {
        if (item.product?.name) return item;
        const productId = item.productId || item.product?._id;
        if (!productId) return item;
        try {
          const data = await productApi.getById(productId);
          const product = data.product || data;
          return { ...item, product: snapshotProduct(product) };
        } catch {
          return item;
        }
      })
    );
    saveGuestCart(hydrated);
    return hydrated;
  };

  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      const items = await hydrateGuestProducts(getGuestCart());
      setCartState(items);
      return;
    }

    try {
      const data = await cartApi.getCart();
      setCartState(extractApiItems(data));
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const addToCart = async (productId, quantity = 1, product = null) => {
    try {
      if (!isAuthenticated) {
        const items = getGuestCart();
        const existing = items.find((item) => item.productId === productId);
        if (existing) {
          existing.quantity += quantity;
          if (product) existing.product = snapshotProduct(product);
        } else {
          items.push({
            productId,
            quantity,
            product: snapshotProduct(product),
          });
        }
        saveGuestCart(items);
        const hydrated = await hydrateGuestProducts(items);
        setCartState(hydrated);
        showSuccess("Added to cart");
        return;
      }

      await cartApi.addToCart(productId, quantity);
      await fetchCartCount();
      showSuccess("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError(error.message || "Failed to add to cart");
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      const items = getGuestCart().filter((item) => item.productId !== productId);
      saveGuestCart(items);
      setCartState(items);
      showSuccess("Item removed from cart");
      return;
    }

    try {
      await cartApi.removeFromCart(productId);
      await fetchCartCount();
      showSuccess("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      showError("Failed to remove item");
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    if (!isAuthenticated) {
      const items = getGuestCart().map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveGuestCart(items);
      setCartState(items);
      return;
    }

    try {
      await cartApi.updateCartItem(productId, quantity);
      await fetchCartCount();
    } catch (error) {
      console.error("Error updating cart item:", error);
      showError("Failed to update quantity");
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const clearCart = async () => {
    if (!isAuthenticated) {
      saveGuestCart([]);
      setCartState([]);
      return;
    }

    try {
      await cartApi.clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      await fetchCartCount();
    }
  };

  const value = {
    cartCount,
    cartItems,
    fetchCartCount,
    updateCartCount,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
