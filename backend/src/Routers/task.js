const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/authentication')
const taskRouter = new express.Router();

//Get all tasks for current user
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