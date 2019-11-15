const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  task_description: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    default: "unfinished"
  },
  priority: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("task", TaskSchema);
