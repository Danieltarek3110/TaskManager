const mongoose = require('mongoose');
const express = require('express');
const validator = require('validator')

//Connect to MongoDB
const dburi = "mongodb://localhost:27017/task-manager-api"
//const dburi = "mongodb+srv://Danieldb:test1234@testclusterdaniel01.1ebqorq.mongodb.net/BlogsDB?retryWrites=true&w=majority";
const app = express();

mongoose.connect(dburi , {
    useNewUrlParser: true
})
    .then( (result)=> {
            app.listen(3000);
            console.log("Connected to DB");
        })
    .catch((err => console.log(err)));

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

// const Task = mongoose.model('Task' , {
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// })

const me02 = new User({
    name: 'Daniel      ',
    email: 'Daniel@Test.com    ',
    password: 'Dan@1@5a567D8',
    Age: 24
})

me02.save().then(()=>{
    console.log(me02);
}).catch((err)=>{
    console.log(err);
})