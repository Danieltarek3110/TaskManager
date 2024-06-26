const express = require("express");
const auth = require("../middleware/authentication");
const {
  getAllUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const taskRouter = new express.Router();

//Get all tasks for current user
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks
 *     description: Endpoint to retrieve tasks belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         description: Filter tasks by completion status.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: description
 *         description: Filter tasks by description.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         description: Sort tasks by a field and order (e.g., "field:order").
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving tasks.
 * @function
 * @name getTasks
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} 404 - If tasks are not found for the authenticated user.
 * @throws {Error} 500 - If there is an internal server error.
 * @returns {Object} - The response object containing tasks or an error message.
 */
taskRouter.get("/tasks", auth, getAllUserTasks);

//Get task by Id for current user
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieve a task based on its unique identifier.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the task to retrieve
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the retrieved task
 *         content:
 *           application/json:
 *             example:
 *               _id: taskId
 *               owner: userId
 *       404:
 *         description: Task not found
 *         content:
 *           text/plain:
 *             example: Task not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             example: Internal Server Error
 */
taskRouter.get("/tasks/:id", auth, getTaskById);

// Create Task
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Endpoint to create a new task.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: task
 *         description: The task object to be created.
 *         required: true
 *         schema:
 *           $ref: '#/definitions/TaskInput'
 *     responses:
 *       201:
 *         description: Successfully created task.
 *         content:
 *           application/json:
 *             example:
 *               _id: taskId
 *       500:
 *         description: Internal Server Error. Indicates a failure in task creation.
 *         content:
 *           application/json:
 *             example:
 *               message: Error message details
 */
/**
 * @typedef {object} TaskInput
 * @property {string} field1 - Description of field1.
 * @property {string} field2 - Description of field2.
 * @property {string} owner - ID of the task owner.
 */
taskRouter.post("/tasks", auth, createTask);

//Update Task
/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task by ID
 *     description: Endpoint to update a task by its ID.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the task to be updated.
 *         required: true
 *         type: string
 *       - in: body
 *         name: updates
 *         description: The updates to be applied to the task.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *             completed:
 *               type: boolean
 *           example:
 *             description: Updated task description
 *             completed: true
 *     responses:
 *       200:
 *         description: Successfully updated task.
 *         content:
 *           application/json:
 *             example:
 *               _id: taskId
 *       400:
 *         description: Bad Request. Invalid update keys provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid updates keys
 *       404:
 *         description: Not Found. Task with the given ID not found.
 *         content:
 *           text/plain:
 *             example: Task not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in task update.
 */
taskRouter.patch("/tasks/:id", auth, updateTask);

//DELETE TASK
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: Endpoint to delete a task by its ID.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the task to be deleted.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted task.
 *         content:
 *           application/json:
 *             example:
 *               _id: taskId
 *       404:
 *         description: Not Found. Task with the given ID not found.
 *         content:
 *           text/plain:
 *             example: Task not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in task deletion.
 */
taskRouter.delete("/tasks/:id", auth, deleteTask);

module.exports = taskRouter;
