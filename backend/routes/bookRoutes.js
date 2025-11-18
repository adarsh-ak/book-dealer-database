import express from 'express';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBookStats
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/stats', protect, admin, getBookStats);
router.get('/:id', getBook);
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);

export default router;
