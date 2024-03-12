const mongoose = require('mongoose');

//Connect to MongoDB
const dburi = "mongodb://localhost:27017/task-manager-api"
//const dburi = "mongodb+srv://Danieldb:test1234@testclusterdaniel01.1ebqorq.mongodb.net/BlogsDB?retryWrites=true&w=majority";

mongoose.connect(dburi)
    .then( (result)=> {
            console.log("Connected to DB");
        })
    .catch((err => console.log(err)));