import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import EmployeeLogin from './components/EmployeeLogin.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Dashboard from './components/Dashboard.jsx';
import Header from './components/Header.jsx';

// API base URL
const API_BASE = 'http://localhost:5000/api';

function App() {
  const [currentView, setCurrentView] = useState('employee-login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = async (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('employee-login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'employee-login':
        return <EmployeeLogin onLogin={handleLogin} onSwitchToAdmin={() => setCurrentView('admin-login')} />;
      case 'admin-login':
        return <AdminLogin onLogin={handleLogin} onSwitchToEmployee={() => setCurrentView('employee-login')} />;
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} />;
      default:
        return <EmployeeLogin onLogin={handleLogin} onSwitchToAdmin={() => setCurrentView('admin-login')} />;
    }
  };

  return (
    <div className="App">
      {currentView !== 'dashboard' && (
        <Header currentView={currentView} />
      )}
      {renderView()}
    </div>
  );
}

export default App;
export { API_BASE };