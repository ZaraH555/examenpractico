const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const productosRouter = require('./routes/productos.js');
app.use('/api/productos', productosRouter);
app.listen(3000, () => {
    console.log('API corriendo en https://localhost:3000/api/productos');
});