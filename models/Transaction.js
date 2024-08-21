// models/Transaction.js 

const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Product title cannot be empty'],
    minlength: [1, 'Product title must be at least 1 character long'],
    maxlength: [255, 'Product title must be at most 255 characters long']
  },
  description: {
    type: String,
    required: [true, 'Product description cannot be empty'],
    minlength: [1, 'Product description must be at least 1 character long'],
    maxlength: [1000, 'Product description must be at most 1000 characters long']
  },
  price: {
    type: Number,
    required: [true, 'Product price cannot be empty'],
    min: [0, 'Product price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Product category cannot be empty'],
    enum: ['men\'s clothing', 'women\'s clothing', 'jewelery', 'electronics', 'Miscellaneous'], // Updated categories
  },
  image: {
    type: String,
    required: [true, 'Product image cannot be empty'],
  },
  sold: {
    type: Boolean,
    default: false,
  },
  dateOfSale: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;