import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Trending', 'Best Seller', 'Harry Potter', 'Romance', 'Science Fiction', 'Mystery']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Book', bookSchema);