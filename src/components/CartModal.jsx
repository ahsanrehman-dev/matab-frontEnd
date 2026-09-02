import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cartApi } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import {
    FaTimes,
    FaPlus,
    FaMinus,
    FaTrash,
    FaShoppingBag,
    FaArrowRight
} from 'react-icons/fa';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();
    const { fetchCartCount, cartItems: contextCartItems, updateCartItemQuantity, removeFromCart, clearCart: clearContextCart } = useCart();

    useEffect(() => {
        if (!isOpen) return;
        if (isAuthenticated) {
            fetchCartItems();
            return;
        }
        setCartItems(
            (contextCartItems || []).map((item) => ({
                ...item,
                product: item.product,
                quantity: item.quantity || 1,
            }))
        );
    }, [isOpen, isAuthenticated, contextCartItems]);

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartApi.getCart();
            setCartItems(response.cart?.items || []);
        } catch (err) {
            setError(err.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const getItemProductId = (item) =>
        item.product?._id || item.productId || item._id;

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 0) return;

        setUpdating(productId);
        try {
            if (!isAuthenticated) {
                await updateCartItemQuantity(productId, newQuantity);
            } else {
                await cartApi.updateCartItem(productId, newQuantity);
                await fetchCartItems();
            }
            await fetchCartCount();
        } catch (err) {
            setError(err.message || 'Failed to update cart');
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (productId) => {
        setUpdating(productId);
        try {
            if (!isAuthenticated) {
                await removeFromCart(productId);
            } else {
                await cartApi.removeFromCart(productId);
                await fetchCartItems();
            }
            await fetchCartCount();
        } catch (err) {
            setError(err.message || 'Failed to remove item');
        } finally {
            setUpdating(null);
        }
    };

    const clearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;

        setLoading(true);
        try {
            if (!isAuthenticated) {
                await clearContextCart();
                setCartItems([]);
            } else {
                await cartApi.clearCart();
                setCartItems([]);
            }
            await fetchCartCount();
        } catch (err) {
            setError(err.message || 'Failed to clear cart');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product?.price || 0) * item.quantity;
        }, 0);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    if (!isOpen) return null;

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h3 className="cart-modal-title">
                        <FaShoppingBag />
                        Shopping Cart ({totalItems})
                    </h3>
                    <button className="cart-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="cart-modal-content">
                    {loading ? (
                        <div className="cart-loading">
                            <LoadingSpinner size="medium" text="Loading cart..." />
                        </div>
                    ) : error ? (
                        <div className="cart-error">
                            <div className="alert alert-danger">
                                {error}
                            </div>
                            <button className="btn btn-primary" onClick={fetchCartItems}>
                                Try Again
                            </button>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <div className="empty-cart-icon">
                                <FaShoppingBag />
                            </div>
                            <h4>Your cart is empty</h4>
                            <p>Add some items to get started</p>
                            <Link to="/products" className="btn btn-primary" onClick={onClose}>
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.product?._id || item._id} className="cart-item">
                                        <div className="cart-item-image">
                                            {item.product?.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="no-image">
                                                    <FaShoppingBag />
                                                </div>
                                            )}
                                        </div>

                                        <div className="cart-item-details">
                                            <h4 className="cart-item-name">
                                                <Link
                                                    to={`/product/${item.product?._id}`}
                                                    onClick={onClose}
                                                >
                                                    {item.product?.name || 'Product not found'}
                                                </Link>
                                            </h4>
                                            <p className="cart-item-category">
                                                {item.product?.category}
                                            </p>
                                            <div className="cart-item-price">
                                                Rs {item.product?.price?.toLocaleString() || '0'}
                                            </div>
                                        </div>

                                        <div className="cart-item-controls">
                                            <div className="quantity-controls">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(getItemProductId(item), item.quantity - 1)}
                                                    disabled={updating === getItemProductId(item) || item.quantity <= 1}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="quantity-display">
                                                    {updating === getItemProductId(item) ? (
                                                        <LoadingSpinner size="small" />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(getItemProductId(item), item.quantity + 1)}
                                                    disabled={updating === getItemProductId(item)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>

                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(getItemProductId(item))}
                                                disabled={updating === getItemProductId(item)}
                                                title="Remove item"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <div className="cart-item-total">
                                            Rs {((item.product?.price || 0) * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {cartItems.length > 0 && (
                                <div className="cart-actions">
                                    <button className="btn btn-outline btn-sm" onClick={clearCart}>
                                        Clear Cart
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="cart-summary">
                            <div className="cart-summary-row">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>Rs {calculateTotal().toLocaleString()}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Shipping</span>
                                <span>
                                    {calculateTotal() > 5000 ? 'Free' : 'Rs 200'}
                                </span>
                            </div>
                            <div className="cart-summary-row total">
                                <span>Total</span>
                                <span>
                                    Rs {(calculateTotal() + (calculateTotal() > 5000 ? 0 : 200)).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="cart-checkout-actions">
                            <Link
                                to="/cart"
                                className="btn btn-outline"
                                onClick={onClose}
                            >
                                View Cart
                            </Link>
                            <Link
                                to="/checkout"
                                className="btn btn-primary"
                                onClick={onClose}
                            >
                                Checkout
                                <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

CartModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CartModal;
