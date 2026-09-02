import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { adminApi } from "../../utils/api";
import { formatRs } from "../../utils/currency";

// Inline lightweight SVG chart for admin trend
const AdminTrendChart = ({ data }) => {
  const width = 1000;
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = (Array.isArray(data) ? data : [])
    .map((d) => ({ date: new Date(d.date), sales: Number(d.sales || 0) }))
    .sort((a, b) => a.date - b.date);

  if (points.length === 0) return null;

  const minX = points[0].date.getTime();
  const maxX = points[points.length - 1].date.getTime();
  const minY = 0;
  const maxY = Math.max(...points.map((p) => p.sales)) || 1;

  const xScale = (t) =>
    padding.left + ((t - minX) / (maxX - minX || 1)) * innerW;
  const yScale = (v) =>
    padding.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  const pathD = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.date.getTime())} ${yScale(p.sales)}`
    )
    .join(" ");

  const xTicks = [
    points[0],
    points[Math.floor(points.length / 2)],
    points[points.length - 1],
  ].filter(Boolean);
  const yTicks = [0, Math.round(maxY / 2), maxY];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Platform Sales Trend"
      style={{ width: "100%", height: "280px" }}
    >
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="#e5e7eb"
      />
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke="#e5e7eb"
      />
      {yTicks.map((v, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={yScale(v)}
            x2={width - padding.right}
            y2={yScale(v)}
            stroke="#f3f4f6"
          />
          <text
            x={padding.left - 8}
            y={yScale(v)}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#64748b"
            fontSize="10"
          >
            {new Intl.NumberFormat("en-PK", {
              maximumFractionDigits: 0,
            }).format(v)}
          </text>
        </g>
      ))}
      <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={xScale(p.date.getTime())}
          cy={yScale(p.sales)}
          r="3"
          fill="#6366f1"
        />
      ))}
      {xTicks.map((p, i) => (
        <text
          key={i}
          x={xScale(p.date.getTime())}
          y={height - padding.bottom + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize="10"
        >
          {p.date.toLocaleDateString()}
        </text>
      ))}
    </svg>
  );
};

AdminTrendChart.propTypes = {
  data: PropTypes.array.isRequired,
};

const AdminDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => formatRs(amount);

  if (loading) return <div className="loading">Loading dashboard stats...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stats) return <div className="error">No stats data available</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Overview of your e-commerce platform</p>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.userCount}</p>
            <p className="stat-label">Registered customers</p>
          </div>
        </div>



        <div className="stat-card">
          <div className="stat-icon products">
            <FiShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Active Products</h3>
            <p className="stat-value">{stats.productCount}</p>
            <p className="stat-label">Available for purchase</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            <p className="stat-label">Platform earnings</p>
          </div>
        </div>
      </div>

      {/* Sales Trend (Dynamic) */}
      <div className="metrics-section">
        <div className="metric-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Sales Trend</h3>
          {Array.isArray(stats.salesTrend) && stats.salesTrend.length > 0 ? (
            <AdminTrendChart data={stats.salesTrend} />
          ) : (
            <div className="activity-placeholder">
              <FiTrendingUp size={48} />
              <p>No sales data available to plot</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="metrics-section">
        <div className="metric-card">
          <h3>Order Statistics</h3>
          <div className="metric-value">{stats.totalOrders}</div>
          <p>Total orders placed</p>
        </div>

        <div className="metric-card">
          <h3>Platform Health</h3>
          <div className="health-indicators">
            <div className="health-item">
              <span className="indicator good"></span>
              <span>Users: {stats.userCount > 0 ? "Active" : "No users"}</span>
            </div>

            <div className="health-item">
              <span className="indicator good"></span>
              <span>
                Products: {stats.productCount > 0 ? "Available" : "No products"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-placeholder">
          <FiTrendingUp size={48} />
          <p>Recent platform activity would be displayed here</p>
          <p>New registrations, orders, and product updates</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
