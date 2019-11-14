const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Tasks = require("../models/Tasks");

//@route    GET api/tasks
//@desc     Get all tasks of the user
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Tasks.find({ user: req.user.id }).sort({
      data: -1
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/tasks
//@desc     Add new task
//@access   Private
router.post(
  "/",
  [
    auth,
    [
      check("task", "Task is required")
        .not()
        .isEmpty()
        .isLength({ max: 240 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { task_description, type, priority } = req.body;

    try {
      const newTask = new Task({
        task_description,
        type,
        priority,
        user: req.user.id
      });
      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/tasks/:id
//@desc     Updata task
//@access   Private
router.put("/:id", auth, async (req, res) => {
  const { task_description, type, priority } = req.body;

  //Build a task object
  const taskFields = {};
  //If has task_description/type/priority,add that to taskField
  if (task_description) taskFields.task_description = task_description;
  if (type) taskFields.type = type;
  if (priority) taskFields.priority = priority;

  try {
    //Find task by taskID
    let task = await Task.findById(req.params.id);
    if (task) return res.status(404).json({ msg: "Task not found" });
    //Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    //Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: taskFields
      },
      //If this task not exist,create it
      { new: true }
    );
    res.json();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/tasks/:id
//@desc     Delete task
//@access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    //Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: "Task Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
