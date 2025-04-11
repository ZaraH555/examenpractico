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
  database: 'patitas_felices'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Successfully connected to database');
});

// API Routes
app.get('/api/mascotas', (req, res) => {
  const query = 'SELECT * FROM mascotas';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching mascotas:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/servicios', (req, res) => {
  const query = 'SELECT * FROM servicios';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching servicios:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/mascotas', (req, res) => {
  const { nombre, raza, edad, imagen, notas } = req.body;
  connection.query(
    'INSERT INTO mascotas (nombre, raza, edad, imagen, notas) VALUES (?, ?, ?, ?, ?)',
    [nombre, raza, edad, imagen, notas],
    (error, result) => {
      if (error) {
        console.error('Error adding mascota:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, nombre, raza, edad, imagen, notas });
    }
  );
});

app.post('/api/servicios', (req, res) => {
  const { nombre, duracion, precio, descripcion, imagen } = req.body;
  connection.query(
    'INSERT INTO servicios (nombre, duracion, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?)',
    [nombre, duracion, precio, descripcion, imagen],
    (error, result) => {
      if (error) {
        console.error('Error adding servicio:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, nombre, duracion, precio, descripcion, imagen });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});