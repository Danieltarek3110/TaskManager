const express = require('express');
const Task = require('../models/task')
const taskRouter = new express.Router();

//Get all tasks
taskRouter.get('/tasks' , async (req, res)=>{
    try{
        const task = await Task.find({});
        if(!task){
            return res.status(404).send
        }
        res.status(200).send()
    }catch(err){
        res.status(500).send()
    }
})

//Get task by Id
taskRouter.get('/tasks/:id' , (req, res)=>{
    Task.findById(req.params.id).then((task)=>{
        if(!task){
            res.status(404).send("Couldn't find task with this ID")
        }
        res.send(task);
    }).catch((err)=>{
        res.status(500);
        console.log(err);
        
    })
})

// Create Task
taskRouter.post('/tasks' ,async (req, res)=>{
    const task = new Task(req.body);
    try{
        await task.save();
        res.status(201).send();
    }catch(err){
        res.status(500).send(err.errors)
    }
})

//Update Task
taskRouter.patch('/tasks/:id' , async (req , res)=>{
    const updates = Object.keys(req.body)
    const allowupdates = ['description' , 'completed']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id , req.body , {new: true , runValidators: true} );
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task);
    }catch(err){
        res.status(500).send()
    }

})

//DELETE TASK
taskRouter.delete('/tasks/:id' , async (req , res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task);

    }catch(err){
        res.status(500).send();
    }
})



module.exports = taskRouter