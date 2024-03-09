const express = require('express');
require('../src/DB/mongoose');
const userRouter = require('../src/Routers/user')
const taskRouter = require('../src/Routers/task');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port , () => {
    console.log("server is listening on port " + port);
});

// const Task = require('../src/models/task')
// const User = require('../src/models/user')

// const main = async ()=>{
//     // const task = await Task.findById('65ec57d38a1a2d72539c60b8')
//     // await task.populate('owner');
//     // console.log(task);
//     const user = await User.findById('65ec57c88a1a2d72539c60b0')
//     await user.populate('tasks')
//     console.log(user.tasks);
// }

// main()