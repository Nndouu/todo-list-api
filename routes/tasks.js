const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Task = require("../models/Task");

/**
 * @swagger
 * /api/tasks:
 *  get:
 *    tags:
 *      - "Task"
 *    summary: Returns a list of tasks
 *    description: Use to request all tasks
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: OK
 */

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({
      data: -1
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @swagger
 * /api/tasks:
 *  post:
 *    tags:
 *      - "Task"
 *    summary: Create a new task
 *    description: Use to create a new task
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: post
 *        description: The post to create
 *        schema:
 *          $ref: '#/definitions/Task'
 *    responses:
 *      '201':
 *        description: Created
 * definitions:
 *   Task:
 *     type: object
 *     required:
 *       - task_description
 *     properties:
 *       task_description:
 *         type: string
 *       type:
 *         type: string
 *         default: unfinished
 *       priority:
 *         type: number
 *         default: 0
 *       date:
 *         type: Date
 *         default: Date.now
 *
 */

router.post(
  "/",
  [
    [
      check("task_description", "task_description is required")
        .not()
        .isEmpty(),
      check(
        "task_description",
        "task_description should not more than 240 characters"
      ).isLength({ max: 240 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { task_description, type, priority } = req.body;

    try {
      let taskCheck = await Task.findOne({ task_description });
      if (taskCheck) {
        return res.status(400).json({ msg: "Task already exists" });
      }
      const newTask = new Task({
        task_description,
        type,
        priority
      });
      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @swagger
 * /api/task/{taskID}:
 *  put:
 *    tags:
 *      - "Task"
 *    summary: Update a specific task
 *    description: Use to update an existing task
 *    parameters:
 *      - in: path
 *        name: taskID
 *        required: true
 *        type: string
 *        description: The ID of a specific task
 *      - in: body
 *        name: task
 *        description: The task to update
 *        schema:
 *          type: object
 *          properties:
 *            'data':
 *              $ref: '#/definitions/Task'
 *    responses:
 *      '200':
 *        description: Successful Operation
 */

router.put("/:id", async (req, res) => {
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
    if (!task) return res.status(404).json({ msg: "Task not found" });

    let taskCheck = await Task.findOne({ task_description });
    if (taskCheck && task.id != taskCheck.id) {
      return res.status(400).json({ msg: "Task already exists" });
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
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @swagger
 * /api/task/{taskID}:
 *  delete:
 *    tags:
 *      - "Task"
 *    summary: Delete a specific task
 *    description: Use to delete an existing task
 *    parameters:
 *      - in: path
 *        name: taskID
 *        required: true
 *        type: string
 *        description: The ID of a specific task
 *    responses:
 *      '200':
 *        description: Successful Operation
 */

router.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: "Task Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
