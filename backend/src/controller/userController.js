const User = require('../models/user')
const Task = require('../models/task')
const sendEmail =  require('../emails/account');

const getCurrentUser = async (req, res)=>{
    res.send(req.user)

}

const deleteCurrentUser = async (req, res) => {
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
}

const logoutUser = async (req , res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save();
        res.status(200).send('Logout Successfully')
    }catch(err){
        res.status(500).send()
    }
}

const logoutAll = async (req , res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Logout Successfully')
    }catch(err){
        res.status(500).send()
    }
}

const getUserById = async (req, res)=>{
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
}

const createUser = async (req, res)=>{
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken();
        await user.save();
        await sendEmail(user.email , user.name);
        res.status(201).send({user , token});
    }catch(e){
        res.status(500).send(e);
        console.log(e)
    }
}

const login =  async (req , res)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user , token});

    }catch(err){
        res.status(400).send(err.toString())
        console.log(err)
    }
}

const updateUserById = async(req , res)=>{
    
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
}

const updateCurrentUser = async(req , res)=>{
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
}

const deleteUserById = async (req , res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user);

    }catch(err){
        res.status(500).send();
    }
}



module.exports = {
    getCurrentUser,
    deleteCurrentUser,
    logoutUser,
    logoutAll,
    getUserById,
    createUser,
    login,
    updateUserById,
    updateCurrentUser,
    deleteUserById,

}