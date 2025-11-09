import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cash-flow-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
const db = new sqlite3.Database('./cashflow.db');

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication
app.post('/api/login', (req, res) => {
  const { username, password, userType } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ? AND type = ?',
    [username, userType],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, type: user.type },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          type: user.type,
          name: user.name
        }
      });
    }
  );
});

// Dashboard Statistics
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const queries = {
    totalBalance: `SELECT COALESCE(SUM(
      CASE WHEN type IN ('sale', 'payment_in') THEN amount ELSE -amount END
    ), 0) as balance FROM transactions WHERE status = 'completed'`,
    
    toReceive: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
                WHERE type = 'sale' AND status = 'pending'`,
    
    toGive: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
             WHERE type = 'purchase' AND status = 'pending'`,
    
    totalSales: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
                 WHERE type = 'sale' AND status = 'completed' 
                 AND date >= date('now', 'start of month')`,
    
    totalPurchases: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
                     WHERE type = 'purchase' AND status = 'completed' 
                     AND date >= date('now', 'start of month')`,
    
    totalExpenses: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
                    WHERE type = 'expense' AND status = 'completed' 
                    AND date >= date('now', 'start of month')`
  };

  const results = {};
  let completedQueries = 0;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], [], (err, row) => {
      if (err) {
        console.error('Database error:', err);
      }
      results[key] = row ? row.total || row.balance : 0;
      completedQueries++;

      if (completedQueries === Object.keys(queries).length) {
        res.json(results);
      }
    });
  });
});

// Contacts API
app.get('/api/contacts', authenticateToken, (req, res) => {
  const { type } = req.query;
  let query = 'SELECT * FROM contacts';
  const params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  query += ' ORDER BY name';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/contacts', authenticateToken, (req, res) => {
  const { name, type, email, phone, address } = req.body;

  db.run(
    'INSERT INTO contacts (name, type, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, type, email, phone, address],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create contact' });
      }
      res.json({ id: this.lastID, message: 'Contact created successfully' });
    }
  );
});

// Inventory API
app.get('/api/inventory', authenticateToken, (req, res) => {
  db.all('SELECT * FROM inventory ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/inventory', authenticateToken, (req, res) => {
  const { name, category, stock, price, low_stock_alert, description } = req.body;

  db.run(
    'INSERT INTO inventory (name, category, stock, price, low_stock_alert, description) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category, stock, price, low_stock_alert, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add inventory item' });
      }
      res.json({ id: this.lastID, message: 'Inventory item added successfully' });
    }
  );
});

app.put('/api/inventory/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, category, stock, price, low_stock_alert, description } = req.body;

  db.run(
    'UPDATE inventory SET name = ?, category = ?, stock = ?, price = ?, low_stock_alert = ?, description = ? WHERE id = ?',
    [name, category, stock, price, low_stock_alert, description, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update inventory item' });
      }
      res.json({ message: 'Inventory item updated successfully' });
    }
  );
});

// Transactions API
app.get('/api/transactions', authenticateToken, (req, res) => {
  const { type, limit = 50 } = req.query;
  
  let query = `
    SELECT t.*, c.name as contact_name 
    FROM transactions t 
    LEFT JOIN contacts c ON t.contact_id = c.id 
  `;
  const params = [];

  if (type) {
    query += ' WHERE t.type = ?';
    params.push(type);
  }

  query += ' ORDER BY t.date DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  const { type, contact_id, receipt_number, amount, date, description, items } = req.body;

  db.run(
    'INSERT INTO transactions (type, contact_id, receipt_number, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)',
    [type, contact_id, receipt_number, amount, date, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create transaction' });
      }

      const transactionId = this.lastID;

      // If there are items (for sales/purchases), insert them
      if (items && items.length > 0) {
        let itemsProcessed = 0;
        
        items.forEach(item => {
          db.run(
            'INSERT INTO transaction_items (transaction_id, inventory_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
            [transactionId, item.inventory_id, item.quantity, item.unit_price],
            function(err) {
              if (err) {
                console.error('Error inserting transaction item:', err);
              }
              
              // Update inventory stock for sales
              if (type === 'sale') {
                db.run(
                  'UPDATE inventory SET stock = stock - ? WHERE id = ?',
                  [item.quantity, item.inventory_id]
                );
              } else if (type === 'purchase') {
                db.run(
                  'UPDATE inventory SET stock = stock + ? WHERE id = ?',
                  [item.quantity, item.inventory_id]
                );
              }

              itemsProcessed++;
              if (itemsProcessed === items.length) {
                res.json({ id: transactionId, message: 'Transaction created successfully' });
              }
            }
          );
        });
      } else {
        res.json({ id: transactionId, message: 'Transaction created successfully' });
      }
    }
  );
});

// Recent Activity
app.get('/api/activity', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      'transaction' as type,
      t.type as sub_type,
      t.description,
      t.amount,
      t.date,
      c.name as contact_name
    FROM transactions t
    LEFT JOIN contacts c ON t.contact_id = c.id
    UNION ALL
    SELECT 
      'inventory' as type,
      'update' as sub_type,
      i.name as description,
      i.stock as amount,
      i.created_at as date,
      NULL as contact_name
    FROM inventory i
    ORDER BY date DESC
    LIMIT 20
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Cash-FLOW backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});