const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const router = new express.Router()
const Task = require('../models/task')

//Get current user

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Endpoint to retrieve the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               username: user123
 *               email: userexample.com
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *         content:
 *           text/plain:
 *             example: Unauthorized
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving user profile.
 */
router.get('/users/me' , auth ,async (req, res)=>{
        res.send(req.user)

})

// DELETE CURRENT USER
/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete the authenticated user
 *     description: Endpoint to delete the profile of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       404:
 *         description: Not Found. User with the given ID not found.
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in user deletion.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
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

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout the authenticated user
 *     description: Endpoint to remove the current authentication token and log out the user.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out user.
 *         content:
 *           text/plain:
 *             example: Logout Successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in logging out the user.
 */

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

/**
 * @swagger
 * /users/logoutAll:
 *   post:
 *     summary: Logout from all sessions
 *     description: Endpoint to remove all authentication tokens and log out the user from all sessions.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out user from all sessions.
 *         content:
 *           text/plain:
 *             example: Logout Successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in logging out the user from all sessions.
 */
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Endpoint to retrieve user information by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be retrieved.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               username: user123
 *               email: user@example.com
 *       404:
 *         description: Not Found. User with the given ID not found.
 *         content:
 *           text/plain:
 *             example: Id not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving user information.
 */
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
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to create a new user.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User object to be created.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Daniel
 *             email: Daniel@example.com
 *             password: userpassword
 *     responses:
 *       201:
 *         description: Successfully created user.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: userId
 *                 username: newUser123
 *                 email: newuser@example.com
 *               token: generatedAuthToken
 *       500:
 *         description: Internal Server Error. Indicates a failure in user creation.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Endpoint to authenticate and login a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials for login.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: user@example.com
 *             password: userpassword
 *     responses:
 *       200:
 *         description: Successfully authenticated and logged in user.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: userId
 *                 username: user123
 *                 email: user@example.com
 *               token: generatedAuthToken
 *       400:
 *         description: Bad Request. Invalid credentials.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid credentials
 *       500:
 *         description: Internal Server Error. Indicates a failure in user login.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
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

/**
 * @swagger
 * /users/Admin/{id}:
 *   patch:
 *     summary: Update user information (Admin)
 *     description: Endpoint to update user information by an admin.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be updated.
 *         required: true
 *         type: string
 *     requestBody:
 *       description: User properties to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: UpdatedName
 *             email: updatedemail@example.com
 *             password: updatedpassword
 *             Age: 30
 *     responses:
 *       200:
 *         description: Successfully updated user information.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               name: UpdatedName
 *               email: updatedemail@example.com
 *       300:
 *         description: Multiple Choices. Indicates a successful update with multiple options.
 *       400:
 *         description: Bad Request. Invalid update keys provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid updates keys
 *       404:
 *         description: Not Found. User with the given ID not found.
 *       500:
 *         description: Internal Server Error. Indicates a failure in updating user information.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
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

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user's information
 *     description: Endpoint to update the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User properties to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: UpdatedName
 *             email: updatedemail@example.com
 *             password: updatedpassword
 *             Age: 30
 *     responses:
 *       200:
 *         description: Successfully updated user information.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               name: UpdatedName
 *               email: updatedemail@example.com
 *       300:
 *         description: Multiple Choices. Indicates a successful update with multiple options.
 *       400:
 *         description: Bad Request. Invalid update keys provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid updates keys
 *       500:
 *         description: Internal Server Error. Indicates a failure in updating user information.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Endpoint to delete a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be deleted.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *       404:
 *         description: Not Found. User with the given ID not found.
 *       500:
 *         description: Internal Server Error. Indicates a failure in user deletion.
 */
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