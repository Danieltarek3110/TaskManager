const express = require('express');
require('../src/DB/mongoose')
const User = require('../src/models/user')

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

app.post('/users' , (req, res)=>{
    const user = new User(req.body);
    user.save().then(()=>{
        res.status(200)
        res.send(user);
    }).catch((err)=>{

        res.status(400).send(err.errors);
        console.log(err);
    })
})


app.listen(port , () => {
    console.log("server is listening on port " + port);
});

