const express = require('express')
const User = require('../models/user')
const router = new express.Router()

//Get all Users
router.get('/users' , async (req, res)=>{
    
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
router.get('/users/:id' , async (req, res)=>{
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
router.post('/users' , async (req, res)=>{
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
router.patch('/users/:id' , async(req , res)=>{
    
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

//DELETE USER
router.delete('/users/:id' , async (req , res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user);

    }catch(err){
        res.status(500).send();
    }
})


module.exports = router