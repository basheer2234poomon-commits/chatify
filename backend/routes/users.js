import express from 'express';
import {
  searchUsers,
  getContacts,
  addContact,
  updateProfile,
  getUserById,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', verifyToken, searchUsers);
router.get('/contacts', verifyToken, getContacts);
router.post('/contacts', verifyToken, addContact);
router.put('/profile', verifyToken, updateProfile);
router.get('/:userId', verifyToken, getUserById);

export default router;
