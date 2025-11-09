import React, { useState, useEffect } from 'react';
import ApiService from "../services/api.js";



const Home = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getRecentActivity()
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'TOTAL BALANCE', value: `$${stats.totalBalance?.toLocaleString() || '0'}`, color: 'success' },
    { title: 'TO RECEIVE', value: `$${stats.toReceive?.toLocaleString() || '0'}`, color: 'primary' },
    { title: 'TO GIVE', value: `$${stats.toGive?.toLocaleString() || '0'}`, color: 'warning' },
    { title: 'SALES', value: `$${stats.totalSales?.toLocaleString() || '0'}`, color: 'info' },
    { title: 'PURCHASE', value: `$${stats.totalPurchases?.toLocaleString() || '0'}`, color: 'secondary' },
    { title: 'EXPENSES', value: `$${stats.totalExpenses?.toLocaleString() || '0'}`, color: 'danger' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Overview</h2>
        <div className="btn-group">
          <button className="btn btn-outline-primary" onClick={loadDashboardData}>
            <i className="fas fa-refresh me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-md-4 col-lg-2">
            <div className={`stats-card card bg-${stat.color} text-white`}>
              <div className="card-body text-center">
                <h6 className="card-title">{stat.title}</h6>
                <h4 className="card-text">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-container">
            <h5>Recent Activity</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Contact</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${getActivityBadgeColor(activity)}`}>
                          {activity.sub_type || activity.type}
                        </span>
                      </td>
                      <td>{activity.description}</td>
                      <td>{activity.contact_name || '-'}</td>
                      <td>
                        {activity.amount ? `$${parseFloat(activity.amount).toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                  {recentActivity.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getActivityBadgeColor(activity) {
  switch (activity.sub_type) {
    case 'sale':
      return 'success';
    case 'purchase':
      return 'warning';
    case 'payment_in':
      return 'primary';
    case 'expense':
      return 'danger';
    case 'update':
      return 'info';
    default:
      return 'secondary';
  }
}

export default Home;