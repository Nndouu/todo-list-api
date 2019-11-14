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
router.put("/:id", (req, res) => {
  res.send("Update task");
});

//@route    DELETE api/tasks/:id
//@desc     Delete task
//@access   Private
router.delete("/:id", (req, res) => {
  res.send("Delete task");
});

module.exports = router;
