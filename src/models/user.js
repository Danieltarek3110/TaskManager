const mongoose = require('mongoose');
const validator = require('validator');



const User = mongoose.model('User' , {
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
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
            throw new Error('Password must be strong')
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
    }
})

module.exports = User;