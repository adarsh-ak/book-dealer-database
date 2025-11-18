import express from 'express';
import {
  createOrder,
  getOrders,
  getAllOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/all', protect, admin, getAllOrders);

export default router;
