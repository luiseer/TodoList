import express from 'express';
import checkAuth from '../middleware/cheeckAuth.js';
const router = express.Router();
import {
  getAllProyects,
  newProyect,
  getProyect,
  editProyect,
  deleteProyect,
  findcollaborator,
  addCollaborator,
  deleteCollaborator
} from '../controllers/proyectController.js';

router.use(checkAuth);

router.route('/').get(getAllProyects).post(newProyect);
router.route('/:id').get(getProyect).put(editProyect).delete(deleteProyect);

router.post('/collaborators', checkAuth, findcollaborator);
router.post('/collaborators/:id', checkAuth, addCollaborator);
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator);

export default router;