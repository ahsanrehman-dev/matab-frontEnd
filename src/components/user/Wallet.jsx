import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { formatRs } from "../../utils/currency";

const Wallet = () => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const error = null;

  useEffect(() => {
    // For now, we'll use mock data since wallet functionality isn't implemented yet
    setWalletData({
      balance: 0.00,
      transactions: []
    });
    setLoading(false);
  }, []);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#6b7280',
    },
    balanceCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '2rem',
      color: 'white',
      marginBottom: '2rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    balanceTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      opacity: '0.9',
    },
    balanceAmount: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    balanceCurrency: {
      fontSize: '1.5rem',
      fontWeight: '500',
      opacity: '0.8',
    },
    section: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 1rem',
      color: '#6b7280',
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      opacity: '0.5',
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#374151',
    },
    emptyText: {
      fontSize: '1rem',
      lineHeight: '1.5',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem 1rem',
      color: '#6b7280',
    },
    error: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '1rem',
      color: '#dc2626',
      marginBottom: '1rem',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading wallet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>My Wallet</h1>
        <p style={styles.subtitle}>Manage your account balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceTitle}>Current Balance</div>
        <div style={styles.balanceAmount}>
          {formatRs(walletData.balance)}
        </div>
        <div style={styles.balanceCurrency}>Rs</div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = '#2563eb'}
            onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
          >
            Add Funds
          </button>
          <button
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = '#059669'}
            onMouseLeave={(e) => e.target.style.background = '#10b981'}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        {walletData.transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <h3 style={styles.emptyTitle}>No transactions yet</h3>
            <p style={styles.emptyText}>
              Your transaction history will appear here once you make your first transaction.
            </p>
          </div>
        ) : (
          <div>
            {/* Transaction list would go here */}
            <p>Transaction history will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Account Information</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280' }}>Account Holder:</span>
            <span style={{ fontWeight: '500' }}>{user?.username || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280' }}>Account Type:</span>
            <span style={{ fontWeight: '500' }}>{user?.role || 'buyer'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ color: '#6b7280' }}>Member Since:</span>
            <span style={{ fontWeight: '500' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet; 