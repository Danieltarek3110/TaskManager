const mongoose = require('mongoose');
require('dotenv').config({ path: './config/dev.env' });

//Connect to MongoDB
const dburi = process.env.mongoDBConn;
//const dburi = "mongodb+srv://Danieldb:test1234@testclusterdaniel01.1ebqorq.mongodb.net/BlogsDB?retryWrites=true&w=majority";

mongoose.connect(dburi)
    .then( (result)=> {
            console.log("Connected to DB");
        })
    .catch((err => console.log(err)));