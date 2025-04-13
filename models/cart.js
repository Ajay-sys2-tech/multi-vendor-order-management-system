const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User schema
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // References the Product schema
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
