import Proyect from '../models/Poryects.js';
import User from '../models/usermodel.js';

//==========================================================//
const getAllProyects = async (req, res) => {
  const proyects = await Proyect.find({
    '$or': [
      { 'collaborators': { $in: req.user } },
      { 'creator': { $in: req.user } },
    ]
  })
    // .where('creator')
    // .equals(req.user)
    .select('-todos')
  res.json(proyects);
};

//==========================================================//
const newProyect = async (req, res) => {
  const proyect = new Proyect(req.body);
  proyect.creator = req.user._id;
  try {
    const proyectstored = await proyect.save();
    res.json(proyectstored);
  } catch (error) {
    console.log(error);
  }
};

//==========================================================//
const getProyect = async (req, res) => {
  const { id } = req.params;
  const proyect = await Proyect.findById(id)
    .populate({
      path: 'todos', 
      populate: {path: 'complete', select: 'name'}})
    .populate('collaborators', 'name email');


  if (!proyect) {
    const error = new Error('not found');
    return res.status(404).json({ message: error.message });
  }

  if (proyect.creator.toString() !== req.user._id.toString() &&
      !proyect.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }

  res.json(proyect);
};

//==========================================================//
const editProyect = async (req, res) => {
  const { id } = req.params;
  const proyect = await Proyect.findById(id);
  if (!proyect) {
    const error = new Error('not found');
    return res.status(404).json({ msg: error.message });
  }
  if (proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }

  proyect.name = req.body.name || proyect.name;
  proyect.description = req.body.description || proyect.description;
  proyect.deliverDate = req.body.deliverDate || proyect.deliverDate;
  proyect.client = req.body.client || proyect.client;

  try {
    const proyectStored = await proyect.save();
    res.json(proyectStored);
  } catch (error) {
    console.log(error);
  }
};

//==========================================================//
const deleteProyect = async (req, res) => {
  const { id } = req.params;
  const proyect = await Proyect.findById(id);
  if (!proyect) {
    const error = new Error('not found');
    return res.status(404).json({ msg: error.message });
  }
  if (proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }
  try {
    await proyect.deleteOne();
    res.json({ msg: 'Delete project success' });
  } catch (error) {
    console.log(error);
  }
};

//==========================================================//
const findcollaborator = async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ email }).select('-confirm -createdAt -token -updatedAt -password -__v');
  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }
  res.json(user);
};

//==========================================================//
const addCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('-confirm -createdAt -token -updatedAt -password -__v');
  const proyect = await Proyect.findById(req.params.id);

  if (!proyect) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }
  if (proyect.creator.toString() !== req.user._id.toString() 
  && !proyect.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString() )) {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  if (proyect.creator.toString() === user._id.toString()) {
    const error = new Error('You are Tyler:  The creator');
    return res.status(404).json({ msg: error.message });
  }

  if (proyect.collaborators.includes(user._id)) {
    const error = new Error('User already collaborator');
    return res.status(404).json({ msg: error.message });
  }

  proyect.collaborators.push(user._id);
  await proyect.save();
  res.json({
    msg: 'Collaborator added'
  })
};

const deleteCollaborator = async (req, res) => {

  const proyect = await Proyect.findById(req.params.id);

  if (!proyect) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }
  if (proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }

  proyect.collaborators.pull(req.body.id);

  await proyect.save();
  res.json({
    msg: 'Collaborator removed successfully'
  })

};

export {
  getAllProyects,
  newProyect,
  getProyect,
  editProyect,
  deleteProyect,
  findcollaborator,
  addCollaborator,
  deleteCollaborator
};
