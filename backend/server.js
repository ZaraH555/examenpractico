const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basededatos'
});

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

app.put('/api/productos/:id', (req, res) => {
  const { nombre, precio, imagen, cantidad } = req.body;
  const id = req.params.id;
  
  connection.query(
    'UPDATE productos SET nombre = ?, precio = ?, imagen = ?, cantidad = ? WHERE id = ?',
    [nombre, precio, imagen, cantidad, id],
    (error, result) => {
      if (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ id, nombre, precio, imagen, cantidad });
    }
  );
});

app.post('/api/productos', (req, res) => {
  const { nombre, precio, imagen, cantidad } = req.body;
  
  connection.query(
    'INSERT INTO productos (nombre, precio, imagen, cantidad) VALUES (?, ?, ?, ?)',
    [nombre, precio, imagen, cantidad],
    (error, result) => {
      if (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, nombre, precio, imagen, cantidad });
    }
  );
});

app.delete('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  
  connection.query(
    'DELETE FROM productos WHERE id = ?',
    [id],
    (error, result) => {
      if (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(204).send();
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});