import React from 'react';

const Sidebar = ({ activeSection, onSectionChange, user, onLogout }) => {
  const menuItems = [
    { id: 'home', label: 'HOME', icon: 'fa-home' },
    { id: 'transactions', label: 'TRANSACTIONS', icon: 'fa-exchange-alt' },
    { id: 'contacts', label: 'CONTACTS', icon: 'fa-address-book' },
    { id: 'inventory', label: 'INVENTORY', icon: 'fa-boxes' },
  ];

  return (
    <div className="sidebar">
      <div className="p-3 border-bottom border-secondary">
        <h5 className="text-white mb-0">
          <i className="fas fa-user-circle me-2"></i>
          {user?.name}
        </h5>
        <small className="text-light">{user?.type.toUpperCase()}</small>
      </div>
      
      <nav className="nav flex-column">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-link text-start ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <i className={`fas ${item.icon} me-2`}></i>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-3 mt-auto border-top border-secondary">
        <button 
          className="btn btn-outline-light w-100"
          onClick={onLogout}
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;