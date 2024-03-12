require('../src/DB/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')


// User.findByIdAndUpdate('65dfbf2ad246d92f9eeb662a' , {Age: 24}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({Age: 24})
// }).then((result)=>{
//     console.log("Count:  " + result);
// }).catch((err)=>{
//     console.log(err);
// })

const UpdateAgeAndCount = async (id , age)=>{
    const user = await User.findByIdAndUpdate(id , {Age: age})
    const count  = await User.countDocuments({Age: age})

}
UpdateAgeAndCount('65dfc081de5b95cabb2b1946' , 27);


const DeleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id)
    if(!task){
       console.log("Task not found")
    }else{
        console.log("Task deleted:  " + task);
    }
    const count = await Task.countDocuments({completed: true});
    console.log(count);
}

DeleteTaskAndCount('65e2524c549d28c707341786');
// Task.findByIdAndDelete('65e2529d549d28c707341794').then((task)=>{
//     if(!task){
//         console.log("Task not found")
//     }
//     console.log('Task deleted: ' + task);
//     return Task.countDocuments({completed: false})
// }).then((result)=>{
//     console.log('Number of incomplete tasks: ' + result);
// }).catch((err)=>{
//     console.log(err);
// })
