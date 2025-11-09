import React, { useState } from 'react';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('payment-in');

  const tabs = [
    { id: 'payment-in', label: 'Payment In', icon: 'fa-download' },
    { id: 'new-sale', label: 'New Sale', icon: 'fa-shopping-cart' },
    { id: 'purchase', label: 'Purchase', icon: 'fa-upload' },
  ];

  return (
    <div>
      <h2 className="mb-4">Transactions</h2>
      
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fas ${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === 'payment-in' && <PaymentInForm />}
      {activeTab === 'new-sale' && <NewSaleForm />}
      {activeTab === 'purchase' && <PurchaseForm />}
    </div>
  );
};

const PaymentInForm = () => {
  return (
    <div className="form-container">
      <h5>Payment Received</h5>
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Choose Contact</label>
            <select className="form-select">
              <option>Select Customer</option>
              <option>ABC Corporation</option>
              <option>XYZ Ltd</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Receipt Number</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Amount Received</label>
            <input type="number" className="form-control" />
          </div>
        </div>
        <button type="submit" className="btn btn-success">Record Payment</button>
      </form>
    </div>
  );
};

const NewSaleForm = () => {
  return (
    <div className="form-container">
      <h5>New Sale</h5>
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Choose Contact</label>
            <select className="form-select">
              <option>Select Customer</option>
              <option>ABC Corporation</option>
              <option>XYZ Ltd</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Receipt Number</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Select Items</label>
          <select multiple className="form-select">
            <option>Laptop Pro - $999</option>
            <option>Wireless Mouse - $25</option>
            <option>Monitor 24" - $299</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Save Sale</button>
      </form>
    </div>
  );
};

const PurchaseForm = () => {
  return (
    <div className="form-container">
      <h5>New Purchase</h5>
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Choose Supplier</label>
            <select className="form-select">
              <option>Select Supplier</option>
              <option>Global Suppliers Inc</option>
              <option>Tech Distributors LLC</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Invoice Number</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Items Purchased</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Total Amount</label>
            <input type="number" className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Payment Date</label>
            <input type="date" className="form-control" />
          </div>
        </div>
        <button type="submit" className="btn btn-warning">Record Purchase</button>
      </form>
    </div>
  );
};

export default Transactions;