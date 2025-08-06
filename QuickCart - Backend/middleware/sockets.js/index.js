const Cart = require('../models/Cart');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-cart', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their cart room`);
    });

    socket.on('update-cart', async (data) => {
      try {
        const { userId, productId, quantity } = data;
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
          cart = new Cart({ user: userId, items: [], total: 0 });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
          existingItem.quantity = quantity;
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
        
        // Emit updated cart to all clients in the room
        io.to(userId).emit('cart-updated', cart);
      } catch (err) {
        console.error(err.message);
        socket.emit('error', { msg: 'Server error' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};