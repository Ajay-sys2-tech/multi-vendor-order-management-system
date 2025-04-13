// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User schema (vendor)
    required: true,
  },
  status:{
    type: String,
    enum: ['created', 'dispatched', 'delivered'],
    default: 'created',
  }
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
