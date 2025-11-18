import Book from '../models/Book.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get book statistics (Admin)
// @route   GET /api/books/stats
// @access  Private/Admin
export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const lowStock = await Book.countDocuments({ stock: { $lt: 50 } });
    const categories = await Book.distinct('category');

    const books = await Book.find();
    const totalValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        lowStock,
        totalCategories: categories.length,
        totalValue: totalValue.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
