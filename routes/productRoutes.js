// routes/productRoutes.js
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Id del producto
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         price:
 *           type: number
 *           description: Precio del producto
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener lista de productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del producto
 *     responses:
 *       200:
 *         description: Un producto
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */

// Datos en memoria (simple, para el ejercicio)
let products = [
  { id: 1, name: 'Laptop Lenovo', price: 3500 },
  { id: 2, name: 'Mouse Logitech', price: 120 }
];

// Helper: validar producto
function validateProduct(req, res, next) {
  const { name, price } = req.body;
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio y no puede estar vacío.' });
  }
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return res.status(400).json({ error: 'El precio debe ser un número válido y >= 0.' });
  }
  next();
}

// GET /api/products
router.get('/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

// POST /api/products
router.post('/products', validateProduct, (req, res) => {
  const { name, price } = req.body;
  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, name: name.trim(), price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/products/:id', validateProduct, (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const { name, price } = req.body;
  products[idx] = { id, name: name.trim(), price };
  res.json(products[idx]);
});

// DELETE /api/products/:id
router.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const removed = products.splice(idx, 1)[0];
  res.json({ message: 'Producto eliminado', product: removed });
});

module.exports = router;
