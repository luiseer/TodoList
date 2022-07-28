import mongoose from 'mongoose';

const proyectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    deliverDate: {
      type: Date,
      default: Date.now()
    },
    client: {
      type: String,
      required: true,
      trim: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'toDo'
      }
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Proyect = mongoose.model('proyect', proyectSchema);

export default Proyect;