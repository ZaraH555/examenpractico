const express = require('express');
const router = express.Router();
const db = require('../db.js');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(resultados);
  });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const { nombre, precio, imagen, cantidad } = req.body;
  db.query(
    'INSERT INTO productos (nombre, precio, imagen, cantidad) VALUES (?, ?, ?, ?)',
    [nombre, precio, imagen, cantidad],
    (err, resultado) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: resultado.insertId, ...req.body });
    }
  );
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const { nombre, precio, imagen, cantidad } = req.body;
  db.query(
    'UPDATE productos SET nombre = ?, precio = ?, imagen = ?, cantidad = ? WHERE id = ?',
    [nombre, precio, imagen, cantidad, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;