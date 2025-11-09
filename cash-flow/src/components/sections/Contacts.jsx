import React, { useState } from 'react';

const Contacts = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [contacts, setContacts] = useState([
    { id: 1, name: 'ABC Corporation', type: 'customer', email: 'contact@abc.com', phone: '+1-234-567-8900' },
    { id: 2, name: 'Global Suppliers Inc', type: 'supplier', email: 'info@globalsuppliers.com', phone: '+1-234-567-8901' },
    { id: 3, name: 'XYZ Ltd', type: 'customer', email: 'sales@xyz.com', phone: '+1-234-567-8902' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'customer',
    email: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      id: contacts.length + 1,
      ...formData
    };
    setContacts([...contacts, newContact]);
    setFormData({ name: '', type: 'customer', email: '', phone: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2 className="mb-4">Contacts</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Contact
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Contact Lists
          </button>
        </li>
      </ul>

      {activeTab === 'create' && (
        <div className="form-container">
          <h5>Create New Contact</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Contact Type</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="type"
                    value="customer"
                    checked={formData.type === 'customer'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Customer</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="type"
                    value="supplier"
                    checked={formData.type === 'supplier'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Supplier</label>
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">Save Contact</button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="table-container">
          <h5>Contact List</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>
                      <span className={`badge ${contact.type === 'customer' ? 'bg-primary' : 'bg-warning'}`}>
                        {contact.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;