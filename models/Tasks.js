const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  task: {
    type: String,
    required: true
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
