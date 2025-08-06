const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], total: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], total: 0 });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Calculate total
    let total = 0;
    for (const item of cart.items) {
      const itemProduct = await Product.findById(item.product);
      total += itemProduct.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove item from cart
router.post('/remove', auth, async (req, res) => {
  const { productId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Recalculate total
    let total = 0;
    for (const item of cart.items) {
      const itemProduct = await Product.findById(item.product);
      total += itemProduct.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;