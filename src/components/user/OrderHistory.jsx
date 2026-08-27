import { useState, useEffect } from 'react';
import { FiPackage, FiCalendar, } from 'react-icons/fi';
import api from '../../utils/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${process.env.Backend_Url}${url}`;
  };

  const fetchOrderHistory = async () => {
    try {
      const data = await api.get('/user/orders');
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh',
      background: '#f8fafc',
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1rem',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '1.2rem',
      color: '#64748b',
    },
    error: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '1.2rem',
      color: '#dc2626',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center',
      color: '#64748b',
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      color: '#94a3b8',
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#374151',
    },
    emptyText: {
      fontSize: '1rem',
      color: '#64748b',
    },
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginTop: '2rem',
    },
    orderCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    orderCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    orderInfo: {
      flex: 1,
    },
    orderTitle: {
      margin: '0 0 0.5rem 0',
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    vendor: {
      color: '#64748b',
      fontSize: '0.875rem',
      marginBottom: '0.25rem',
    },
    orderDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b',
      fontSize: '0.875rem',
    },
    statusBadge: {
      background: '#dcfce7',
      color: '#166534',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    orderDetails: {
      display: 'flex',
      padding: '1.5rem',
      gap: '1rem',
    },
    productImage: {
      width: '100px',
      height: '100px',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    productImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    placeholderImage: {
      color: '#94a3b8',
      fontSize: '0.75rem',
    },
    orderSummary: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    quantity: {
      color: '#64748b',
      fontSize: '0.875rem',
    },
    price: {
      color: '#059669',
      fontSize: '1rem',
      fontWeight: '600',
    },
    total: {
      color: '#1e293b',
      fontSize: '1.125rem',
      fontWeight: '700',
    },
    orderActions: {
      display: 'flex',
      gap: '0.5rem',
      padding: '1.5rem',
      borderTop: '1px solid #e5e7eb',
    },
    btnPrimary: {
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      fontSize: '0.875rem',
    },
    btnPrimaryHover: {
      background: '#2563eb',
    },
    btnSecondary: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #e5e7eb',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.875rem',
    },
    btnSecondaryHover: {
      background: '#e5e7eb',
    },
  };

  if (loading) return <div style={styles.loading}>Loading order history...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Order History</h1>
        <p style={styles.subtitle}>Your past orders and purchases</p>
      </div>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <FiPackage style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No orders yet</h3>
          <p style={styles.emptyText}>Your order history will appear here</p>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div style={styles.orderInfo}>
                  <h3 style={styles.orderTitle}>{order.product?.name || 'Product Name'}</h3>
                  <p style={styles.vendor}>Vendor: {order.vendor?.username || 'Unknown Vendor'}</p>
                  <p style={styles.orderDate}>
                    <FiCalendar /> {formatDate(order.date)}
                  </p>
                </div>
                <div>
                  <span style={styles.statusBadge}>
                    {order.status || 'Completed'}
                  </span>
                </div>
              </div>

              <div style={styles.orderDetails}>
                <div style={styles.productImage}>
                  {order.product?.images && order.product.images[0] ? (
                    <img
                      src={getImageUrl(order.product.images[0])}
                      alt={order.product.name}
                      style={styles.productImageImg}
                    />
                  ) : (
                    <div style={styles.placeholderImage}>No Image</div>
                  )}
                </div>

                <div style={styles.orderSummary}>
                  <p style={styles.quantity}>Quantity: {order.quantity}</p>
                  <p style={styles.price}>
                    PKR {order.price?.toLocaleString()} each
                  </p>
                  <p style={styles.total}>
                    Total: PKR {((order.price || 0) * (order.quantity || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={styles.orderActions}>
                <button
                  style={styles.btnSecondary}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                  }}
                >
                  Reorder
                </button>
                <button
                  style={styles.btnPrimary}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#3b82f6';
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 