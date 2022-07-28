import Proyect from '../models/Poryects.js';
import ToDo from '../models/ToDo.js';

const addToDo = async (req, res) => {
  const { proyect } = req.body;
  const validProyect = await Proyect.findById(proyect);

  if (!validProyect) {
    const error = new Error('Proyect dosent exist');
    return res.status(404).json({
      msg: error.message
    });
  }
  if (validProyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('insufficient permissions');
    return res.status(404).json({
      msg: error.message
    });
  }
  try {
    const todoStored = await ToDo.create(req.body);
    //stored project id
    validProyect.todos.push(todoStored._id);
    await validProyect.save();
    res.json(todoStored);
  } catch (error) {
    console.log(error);
  }
};

//==========================================================
const getToDo = async (req, res) => {
  const { id } = req.params;
  const todo = await ToDo.findById(id).populate('proyect');

  if (!todo) {
    const error = new Error('todo not found');
    return res.status(404).json({
      msg: error.message
    });
  }

  if (todo.proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('invalid action');
    return res.status(403).json({
      msg: error.message
    });
  }

  res.json(todo);
};

//==========================================================
const upDateToDo = async (req, res) => {
  const { id } = req.params;
  const todo = await ToDo.findById(id).populate('proyect');

  if (!todo) {
    const error = new Error('todo not found');
    return res.status(404).json({
      msg: error.message
    });
  }

  if (todo.proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('invalid action');
    return res.status(403).json({
      msg: error.message
    });
  }

  todo.name = req.body.name || todo.name;
  todo.description = req.body.description || todo.description;
  todo.priority = req.body.priority || todo.priority;
  todo.deliveryDate = req.body.deliveryDate || todo.deliveryDate;

  try {
    const todoStored = await todo.save();
    res.json(todoStored);
  } catch (error) {
    console.log(error);
  }
};

//==========================================================
const deleteToDo = async (req, res) => {
  const { id } = req.params;
  const todo = await ToDo.findById(id).populate('proyect');

  if (!todo) {
    const error = new Error('not found');
    return res.status(404).json({ msg: error.message });
  }

  if (todo.proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }

  try {
    const proyect = await Proyect.findById(todo.proyect);
    proyect.todos.pull(todo._id);
    await Promise.allSettled([
      await proyect.save(),
      await todo.deleteOne()

    ]);
    res.json({ msg: 'the task was deleted successfully' });
  } catch (error) {
    console.log(error);
  }
};

//==========================================================
const changeState = async (req, res) => {
  const { id } = req.params;
  const todo = await ToDo.findById(id).populate('proyect')

  if (!todo) {
    const error = new Error('not found');
    return res.status(404).json({ msg: error.message });
  }

  if (todo.proyect.creator.toString() !== req.user._id.toString() && 
  !todo.proyect.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) 
  {
    const error = new Error('Access denied');
    return res.status(404).json({ msg: error.message });
  }
  
  todo.state = !todo.state;
  todo.complete = req.user._id
  await todo.save();

  const todoStored = await ToDo.findById(id)
    .populate('proyect')
    .populate('complete');

  res.json(todoStored)
};
export { addToDo, getToDo, upDateToDo, deleteToDo, changeState };
