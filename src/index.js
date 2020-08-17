const express = require('express')
require('./db/mongoose')
require('express-formidable')
require('express-session')


const Users = require('./model/user')
const Tasks = require('./model/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
//app.use('/admin', require('./model/admin'))

app.listen(port,()=>{

    console.log('Your server working on port ' + port);
    
})


const main = async ()=>{
    // const task = await Tasks.findById('5dcf6faa481d6e2168d347d1')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner);

    const user = await Users.findById('5dcf6fa2481d6e2168d347cf')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks);
    
} 

main()


