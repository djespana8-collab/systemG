import { API_BASE } from '../../config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  // Dashboard
  async getDashboardStats() {
    const response = await fetch(`${this.baseURL}/dashboard/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getRecentActivity() {
    const response = await fetch(`${this.baseURL}/activity`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Contacts
  async getContacts(type = null) {
    const url = type
      ? `${this.baseURL}/contacts?type=${type}`
      : `${this.baseURL}/contacts`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createContact(contactData) {
    const response = await fetch(`${this.baseURL}/contacts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contactData)
    });
    return this.handleResponse(response);
  }

  // Inventory
  async getInventory() {
    const response = await fetch(`${this.baseURL}/inventory`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createInventoryItem(itemData) {
    const response = await fetch(`${this.baseURL}/inventory`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    return this.handleResponse(response);
  }

  async updateInventoryItem(id, itemData) {
    const response = await fetch(`${this.baseURL}/inventory/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    return this.handleResponse(response);
  }

  // Transactions
  async getTransactions(type = null, limit = 50) {
    const url = type
      ? `${this.baseURL}/transactions?type=${type}&limit=${limit}`
      : `${this.baseURL}/transactions?limit=${limit}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createTransaction(transactionData) {
    const response = await fetch(`${this.baseURL}/transactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData)
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();
