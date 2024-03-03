const express = require('express');
require('../src/DB/mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

//Get all Users
app.get('/users' , async (req, res)=>{
    
    try{
        const users = await User.find({});
        if(!users){
            return res.status(404).send("No users found")
        }
        res.status(200).send(users);
        
    }catch(err){
        res.status(400).send();

    }

})

//Get user by ID
app.get('/users/:id' , async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).send("Id not found");
        }else{
            res.status(200).send(user);
        }

    }catch(e){
        res.status(400).send();
    }
})

//Create User
app.post('/users' , async (req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(200).send(user);
    }catch(e){
        res.status(500).send(e.errors);
        console.log(e)
    }
})

//UPDATE USER
app.patch('/users/:id' , async(req , res)=>{
    
    const updates = Object.keys(req.body);
    const allowupdates = ['name', 'email' , 'password' , 'Age']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id , req.body , {new: true , runValidators: true} );
        if(!user){
            return res.status(404).send();
        }
        res.status(200).send(user)
    }catch(err){
        res.status(500).send();
    }
})

// Create Task
app.post('/tasks' ,async (req, res)=>{
    const task = new Task(req.body);
    try{
        await task.save();
        res.status(201).send();
    }catch(err){
        res.status(500).send(err.errors)
    }
})

//Get all tasks
app.get('/tasks' , async (req, res)=>{
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
app.get('/tasks/:id' , (req, res)=>{
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

//Update Task
app.patch('/tasks/:id' , async (req , res)=>{
    const updates = Object.keys(req.body)
    const allowupdates = ['description' , 'completed']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id , res.body , {new: true , runValidators: true} )
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task);
    }catch(err){
        res.status(500).send()
    }

    /* 
    const updates = Object.keys(req.body);
    const allowupdates = ['name', 'email' , 'password' , 'Age']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id , req.body , {new: true , runValidators: true} );
        if(!user){
            return res.status(404).send();
        }
        res.status(200).send(user)
    }catch(err){
        res.status(500).send();
    }
    */

})


app.listen(port , () => {
    console.log("server is listening on port " + port);
});


