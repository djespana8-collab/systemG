import React, { useState } from 'react';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Laptop Pro', category: 'Electronics', stock: 15, price: 999, lowStock: 5 },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', stock: 3, price: 25, lowStock: 10 },
    { id: 3, name: 'Monitor 24"', category: 'Electronics', stock: 0, price: 299, lowStock: 3 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    price: '',
    lowStock: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: inventory.length + 1,
      ...formData,
      stock: parseInt(formData.stock),
      price: parseFloat(formData.price),
      lowStock: parseInt(formData.lowStock)
    };
    setInventory([...inventory, newItem]);
    setFormData({ name: '', category: '', stock: '', price: '', lowStock: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStockStatus = (item) => {
    if (item.stock === 0) return { text: 'Out of Stock', class: 'danger' };
    if (item.stock <= item.lowStock) return { text: 'Low Stock', class: 'warning' };
    return { text: 'In Stock', class: 'success' };
  };

  return (
    <div>
      <h2 className="mb-4">Inventory</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add New Item
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Show Inventory Status
          </button>
        </li>
      </ul>

      {activeTab === 'add' && (
        <div className="form-container">
          <h5>Add New Inventory Item</h5>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Current Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Low Stock Alert</label>
                <input
                  type="number"
                  className="form-control"
                  name="lowStock"
                  value={formData.lowStock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-success">Add Item</button>
          </form>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="table-container">
          <h5>Inventory Status</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => {
                  const status = getStockStatus(item);
                  const value = item.stock * item.price;
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock}</td>
                      <td>${item.price}</td>
                      <td>
                        <span className={`badge bg-${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td>${value.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <h6>Inventory Summary</h6>
            <div className="row">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h6>Total Items</h6>
                    <h4>{inventory.length}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h6>In Stock</h6>
                    <h4>{inventory.filter(item => item.stock > item.lowStock).length}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body text-center">
                    <h6>Low Stock</h6>
                    <h4>{inventory.filter(item => item.stock > 0 && item.stock <= item.lowStock).length}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white">
                  <div className="card-body text-center">
                    <h6>Out of Stock</h6>
                    <h4>{inventory.filter(item => item.stock === 0).length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;