import React from 'react';

const Header = ({ currentView }) => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand mb-0 h1">
          <i className="fas fa-money-bill-wave me-2"></i>
          Cash-FLOW
        </span>
        <div className="navbar-text">
          {currentView === 'employee-login' ? 'Employee Portal' : 'Admin Portal'}
        </div>
      </div>
    </nav>
  );
};

export default Header;