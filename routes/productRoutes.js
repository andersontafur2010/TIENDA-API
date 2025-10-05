// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { Product } = require('../models');

/**
 * Validación simple
 */
function validateProductInput(req, res, next) {
  const { name, price } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: 'El precio debe ser un número >= 0' });
  }
  req.body.name = name.trim();
  req.body.price = priceNum;
  next();
}

// GET /api/products
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/products', validateProductInput, async (req, res, next) => {
  try {
    const newP = await Product.create({ name: req.body.name, price: req.body.price });
    res.status(201).json(newP);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/products/:id', validateProductInput, async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    await p.update({ name: req.body.name, price: req.body.price });
    res.json(p);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/products/:id', async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    await p.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
