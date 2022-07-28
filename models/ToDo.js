import mongoose from 'mongoose';

const toDoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    state: {
      type: Boolean,
      default: false
    },
    deliveryDate: {
      type: Date,
      required: true,
      default: Date.now()
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high']
    },
    proyect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'proyect'
    },
    complete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
);

const ToDo = mongoose.model('toDo', toDoSchema);

export default ToDo;
