const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }

        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate(value){
         if(!validator.isStrongPassword(value)){
            throw Error('Password must be strong')
         }   
        }

    },
    Age: {
        type: Number,
        default: 0,
        validate(value){
            if(value <0){
                throw new Error('Age must be a positive number')
            }

        }
    },
    tokens:[{
        token: {
            type: String,
            required: true

        }
    }]
} , {
    timestamps: true
})

userSchema.virtual('tasks' , {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email , password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch){
        throw new Error('Incorrect username or password!')
    }

    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    token = jwt.sign({_id: user._id.toString()} , 'JWTTOKEN')
    user.tokens = user.tokens.concat({token})
    await user.save();
    
    return token;

}

userSchema.methods.toJSON = function(){
    const user = this
    const publicData = user.toObject();

    delete publicData.tokens;
    delete publicData.password;

    return publicData;
}

// Hash password before saving
userSchema.pre('save' , async function (next){
    const user  = this
    if(user.isModified('password')){
       user.password =  await bcrypt.hash(user.password , 8);
    }
    next()
})



const User = mongoose.model('User' , userSchema)

module.exports = User;