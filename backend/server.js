const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Create database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basededatos'
});

// Test database connection
connection.connect(error => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Successfully connected to database');
});

// API Routes
app.get('/api/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (error, results) => {
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});