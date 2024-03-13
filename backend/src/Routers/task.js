const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/authentication')
const taskRouter = new express.Router();

//Get all tasks for current user

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks for the authenticated user
 *     description: Retrieve tasks associated with the authenticated user.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with tasks for the user.
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "_id": "60f3a5418fdd65699c74b227",
 *                   "title": "Sample Task",
 *                   "description": "This is a sample task",
 *                   "owner": "60f3a5418fdd65699c74b226",
 *                   "createdAt": "2022-07-18T12:34:56.789Z",
 *                   "updatedAt": "2022-07-18T12:34:56.789Z"
 *                 },
 *                 // Additional task objects
 *               ]
 *       404:
 *         description: Task not found for the authenticated user.
 *         content:
 *           text/plain:
 *             example: Task not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             example: Internal Server Error
 *
 * @function
 * @name getTasks
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} 404 - If tasks are not found for the authenticated user.
 * @throws {Error} 500 - If there is an internal server error.
 * @returns {Object} - The response object containing tasks or an error message.
 */
taskRouter.get('/tasks' , auth , async(req , res)=>{
    const match = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.description){
        match.description = req.query.description
    }
    console.log(match)

    try{
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        })
        res.send(req.user.tasks);

    }catch(e){
        res.status(500).send();
    }
})

taskRouter.get('/tasks' , auth  , async (req, res)=>{
    try{
        const task = await Task.find({owner: req.user._id})
        if(task.$isEmpty){
            res.status(404).send("Task not found")
        }
        res.status(200).send(task)
    }catch(err){
        res.status(500).send()

    }
})



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
taskRouter.get('/tasks/:id' , auth , async (req, res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findOne({_id ,  owner: req.user._id})
        if(!task){
            res.status(404).send("Task not found")
        }
        res.status(200).send(task)
    }catch(err){
        res.status(500).send()

    }
})

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

taskRouter.post('/tasks' , auth  , async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try{
        await task.save();
        res.status(201).send(task);
    }catch(err){
        res.status(500).send(err.errors)
    }
})

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
taskRouter.patch('/tasks/:id' , auth  , async (req , res)=>{
    const updates = Object.keys(req.body)
    const allowupdates = ['description' , 'completed']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        
        const task = await Task.findOne({_id: req.params.id  , owner: req.user._id})
        if(!task){
            return res.status(404).send("Task not found")
        }
        updates.forEach((update)=> task[update]= req.body[update])
        await task.save()
        res.status(200).send(task);
    }catch(err){
        res.status(500).send()
    }

})

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
taskRouter.delete('/tasks/:id' , auth  , async (req , res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id , owner: req.user.id})
        if(!task){
            return res.status(404).send("Task not found")
        }
        res.status(200).send(task);

    }catch(err){
        res.status(500).send();
    }
})



module.exports = taskRouter