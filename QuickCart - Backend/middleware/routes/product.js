const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add product (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  try {
    const newProduct = new Product({ name, description, price, category, stock, imageUrl });
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update product (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, price, category, stock, imageUrl } },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete product (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    await Product.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;