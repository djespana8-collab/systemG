import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Home from './sections/Home.jsx';
import Transactions from './sections/Transactions.jsx';
import Contacts from './sections/Contacts.jsx';
import Inventory from './sections/Inventory.jsx';

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'transactions':
        return <Transactions />;
      case 'contacts':
        return <Contacts />;
      case 'inventory':
        return <Inventory />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="d-flex">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          user={user}
          onLogout={onLogout}
        />
        <div className="content-area flex-grow-1">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;