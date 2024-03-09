const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const router = new express.Router()
const Task = require('../models/task')

//Get current user
router.get('/users/me' , auth ,async (req, res)=>{
        res.send(req.user)

})

// DELETE CURRENT USER
router.delete('/users/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await Task.deleteMany({ owner: req.user.id });
        await User.deleteOne({ _id: req.user.id });

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//LOGOUT
router.post('/users/logout' , auth , async (req , res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save();
        res.status(200).send('Logout Successfully')
    }catch(err){
        res.status(500).send()
    }
})

//LOGOUT of all sessions
router.post('/users/logoutAll' , auth , async (req , res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Logout Successfully')
    }catch(err){
        res.status(500).send()
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
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user , token});
    }catch(e){
        res.status(500).send(e);
        console.log(e)
    }
})

//LOGIN USER
router.post('/users/login' , async (req , res)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user , token});

    }catch(err){
        res.status(400).send(err.toString())
        console.log(err)
    }
})

//UPDATE USER
router.patch('/users/Admin/:id' , async(req , res)=>{
    
    const updates = Object.keys(req.body);
    const allowupdates = ['name', 'email' , 'password' , 'Age']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id)
        updates.forEach((update)=> user[update] = req.body[update])
        
        const data = await user.save()
        if(!data){
            return res.status(300).send()
        }
        
        if(!user){
            return res.status(404).send();
        }
        res.status(200).send(user)
    }catch(err){
        res.status(500).send(err);
    }
})

//UPDATE CUURENT USER
router.patch('/users/me' , auth , async(req , res)=>{
    const updates = Object.keys(req.body);
    const allowupdates = ['name', 'email' , 'password' , 'Age']
    const isValidOperation = updates.every((update)=> allowupdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates keys'})
    }
    try{
        updates.forEach((update)=> req.user[update] = req.body[update])
        
        const data = await req.user.save()
        if(!data){
            return res.status(300).send()
        }
        res.status(200).send(req.user)
    }catch(err){
        res.status(500).send(err);
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