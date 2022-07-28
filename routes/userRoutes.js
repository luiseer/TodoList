import express from 'express';
import checkAuth from '../middleware/cheeckAuth.js';
const router = express.Router();
import {
  registerUser,
  authenticate,
  confirm,
  forgot,
  validateToken,
  newPassword,
  perfil
} from '../controllers/userController.js';

router.post('/', registerUser);
router.post('/login', authenticate);
router.get('/confirm/:token', confirm);
router.post('/forgot-password', forgot);
router.route('/forgot-password/:token').get(validateToken).post(newPassword);

router.get('/profile', checkAuth, perfil);

export default router;
