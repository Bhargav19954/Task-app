const mongoose = require("mongoose");

const Task = mongoose.model('Task', {
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  target_date: {
    type: Date,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Todo', 'In-progress', 'Done'],
    default: 'Todo'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image : {
    type : Buffer
  }
})

module.exports = Task;