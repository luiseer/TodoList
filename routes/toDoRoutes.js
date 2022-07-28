import express from 'express';
import {
  addToDo,
  getToDo,
  upDateToDo,
  deleteToDo,
  changeState
} from '../controllers/toDoController.js';
import checkAuth from '../middleware/cheeckAuth.js';

const router = express.Router();

router.post('/', checkAuth, addToDo);

router
  .route('/:id')
  .get(checkAuth, getToDo)
  .put(checkAuth, upDateToDo)
  .delete(checkAuth, deleteToDo);

router.post('/state/:id', checkAuth, changeState);

export default router;
