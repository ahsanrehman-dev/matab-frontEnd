import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import {
    FaBars,
    FaTimes,
    FaUser,
    FaShoppingCart,
    FaSearch,
    FaHeart,
    FaSignOutAlt,
    FaCog
} from 'react-icons/fa';
import './ResponsiveHeader.css';

const ResponsiveHeader = ({ onMenuClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.header-profile-menu') && !event.target.closest('.profile-trigger')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        if (onMenuClick) {
            onMenuClick();
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
        setIsProfileOpen(false);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsMenuOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    const navigationLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/category/electronics', label: 'Electronics' },
        { to: '/category/clothing', label: 'Clothing' },
        { to: '/category/home-garden', label: 'Home & Garden' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' }
    ];

    return (
        <header className={`responsive-header ${isScrolled ? 'scrolled' : ''}`}>
            {/* Top Bar */}
            <div className="header-top">
                <div className="container">
                    <div className="header-top-content">
                        <div className="header-info">
                            <span>📞 +92 300 1234567</span>
                            <span>📧 info@marketmatch.com</span>
                        </div>
                        <div className="header-social">
                            <span>Follow us:</span>
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Twitter">🐦</a>
                            <a href="#" aria-label="Instagram">📷</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="header-main">
                <div className="container">
                    <div className="header-content">
                        {/* Logo */}
                        <div className="header-logo">
                            <Link to="/" className="logo-link">
                                <span className="logo-icon">🛍️</span>
                                <span className="logo-text">MarketMatch</span>
                            </Link>
                        </div>

                        {/* Search Bar (Desktop) */}
                        <div className="header-search desktop-search">
                            <form onSubmit={handleSearch} className="search-form">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <button type="submit" className="search-button">
                                    <FaSearch />
                                </button>
                            </form>
                        </div>

                        {/* Header Actions */}
                        <div className="header-actions">
                            {/* Search Button (Mobile) */}
                            <button
                                className="action-button mobile-search-btn"
                                onClick={toggleSearch}
                                aria-label="Search"
                            >
                                <FaSearch />
                            </button>

                            {/* Favorites */}
                            {isAuthenticated && (
                                <Link to="/favorites" className="action-button">
                                    <FaHeart />
                                    {cartCount > 0 && <span className="badge">{cartCount}</span>}
                                </Link>
                            )}

                            {/* Cart */}
                            <button
                                className="action-button cart-button"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </button>

                            {/* User Profile */}
                            {isAuthenticated ? (
                                <div className="header-profile">
                                    <button
                                        className="action-button profile-trigger"
                                        onClick={toggleProfile}
                                        aria-label="User Profile"
                                    >
                                        <FaUser />
                                        <span className="profile-name">{user?.username}</span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="header-profile-menu">
                                            <div className="profile-info">
                                                <div className="profile-avatar">
                                                    <FaUser />
                                                </div>
                                                <div className="profile-details">
                                                    <h4>{user?.username}</h4>
                                                    <p>{user?.email}</p>
                                                    <span className="profile-role">{user?.role}</span>
                                                </div>
                                            </div>
                                            <div className="profile-menu-links">
                                                <Link to="/profile" className="profile-link">
                                                    <FaUser /> My Profile
                                                </Link>
                                                <Link to="/orders" className="profile-link">
                                                    📦 My Orders
                                                </Link>
                                                <Link to="/favorites" className="profile-link">
                                                    <FaHeart /> Favorites
                                                </Link>
                                                {user?.role === 'vendor' && (
                                                    <Link to="/dashboard" className="profile-link">
                                                        <FaCog /> Vendor Dashboard
                                                    </Link>
                                                )}
                                                {user?.role === 'admin' && (
                                                    <Link to="/dashboard" className="profile-link">
                                                        <FaCog /> Admin Dashboard
                                                    </Link>
                                                )}
                                                <button onClick={handleLogout} className="profile-link logout-link">
                                                    <FaSignOutAlt /> Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {/* Mobile Menu Toggle */}
                            <button
                                className="action-button mobile-menu-btn"
                                onClick={toggleMenu}
                                aria-label="Toggle Menu"
                            >
                                {isMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu (Desktop) */}
            <nav className="header-nav desktop-nav">
                <div className="container">
                    <ul className="nav-links">
                        {navigationLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="mobile-search-overlay">
                    <div className="mobile-search-content">
                        <form onSubmit={handleSearch} className="mobile-search-form">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mobile-search-input"
                                autoFocus
                            />
                            <button type="submit" className="mobile-search-submit">
                                <FaSearch />
                            </button>
                        </form>
                        <button
                            className="mobile-search-close"
                            onClick={() => setIsSearchOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu-content">
                        <div className="mobile-menu-header">
                            <h3>Menu</h3>
                            <button
                                className="mobile-menu-close"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <nav className="mobile-nav">
                            <ul className="mobile-nav-links">
                                {navigationLinks.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

            {/* Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </header>
    );
};

export default ResponsiveHeader;
