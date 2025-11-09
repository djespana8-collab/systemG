import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./cashflow.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('employee', 'admin')),
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Contacts table
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('customer', 'supplier')),
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Inventory table
  db.run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    low_stock_alert INTEGER NOT NULL DEFAULT 5,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('sale', 'purchase', 'payment_in', 'expense')),
    contact_id INTEGER,
    receipt_number TEXT,
    amount DECIMAL(10,2) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts (id)
  )`);

  // Transaction items table
  db.run(`CREATE TABLE IF NOT EXISTS transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    inventory_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory (id)
  )`);

  // Insert default users
  const saltRounds = 10;
  const adminPassword = bcrypt.hashSync('admin123', saltRounds);
  const employeePassword = bcrypt.hashSync('emp123', saltRounds);

  db.run(`INSERT OR IGNORE INTO users (username, password, type, name) 
          VALUES (?, ?, ?, ?)`, 
          ['admin', adminPassword, 'admin', 'System Administrator']);

  db.run(`INSERT OR IGNORE INTO users (username, password, type, name) 
          VALUES (?, ?, ?, ?)`, 
          ['employee1', employeePassword, 'employee', 'John Doe']);

  // Insert sample contacts
  db.run(`INSERT OR IGNORE INTO contacts (name, type, email, phone) 
          VALUES (?, ?, ?, ?)`, 
          ['ABC Corporation', 'customer', 'contact@abc.com', '+1-234-567-8900']);

  db.run(`INSERT OR IGNORE INTO contacts (name, type, email, phone) 
          VALUES (?, ?, ?, ?)`, 
          ['Global Suppliers Inc', 'supplier', 'info@globalsuppliers.com', '+1-234-567-8901']);

  // Insert sample inventory
  db.run(`INSERT OR IGNORE INTO inventory (name, category, stock, price, low_stock_alert) 
          VALUES (?, ?, ?, ?, ?)`, 
          ['Laptop Pro', 'Electronics', 15, 999.99, 5]);

  db.run(`INSERT OR IGNORE INTO inventory (name, category, stock, price, low_stock_alert) 
          VALUES (?, ?, ?, ?, ?)`, 
          ['Wireless Mouse', 'Accessories', 3, 25.50, 10]);

  // Insert sample transactions
  db.run(`INSERT OR IGNORE INTO transactions (type, contact_id, receipt_number, amount, date, description) 
          VALUES (?, ?, ?, ?, ?, ?)`, 
          ['sale', 1, 'SALE-001', 1200.00, '2024-01-15 10:30:00', 'Product sale']);

  console.log('Database initialized with sample data');
});

db.close();