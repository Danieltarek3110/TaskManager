const express = require('express');
require('../src/DB/mongoose');
const userRouter = require('../src/Routers/user');
const taskRouter = require('../src/Routers/task');

const app = express();
const port = process.env.PORT || 3000
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port , () => {
    console.log("server is listening on port " + port);
});