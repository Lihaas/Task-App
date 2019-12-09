const express = require('express')
const Tasks = require('../model/task')
const auth = require('../middleware/auth')
const router = new express.Router()


//Create Task
router.post('/tasks',auth,async (req,res)=>{

    // const Task = new Tasks(req.body)

    const Task = new Tasks({
        ...req.body,
        owner: req.user._id
    })


try {
        await Task.save()
        res.status(201).send(Task)

    } catch (error) {
        res.status(400).send(error)
    }
})



//Get All Tasks
//GET /tasks?isDone=true
//GET /tasks?limit=2
//GET /tasks?sortBy=createdBY:desc
router.get('/tasks',auth ,async (req,res)=>{
    const matchs = {}
    const sorts = {}
    if(req.query.isDone){
        matchs.isDone = req.query.isDone === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sorts[parts[0]] = parts[1] ==='desc' ? -1 : 1
       // console.log(parseInt(sorts.isDone));
        
        
    }


 try {
     // This can search task whoes owner is login owner
    // const task = await Tasks.find({owner:req.user._id})
    // res.send(task)

    //Alternative approch
    // await req.user.populate('tasks').execPopulate()
    // res.send(req.user.tasks)


    //Populate on basis of  GET isDone
            await req.user.populate({
            path : 'tasks',
            match :matchs,
            options :{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort : sorts
            }
        }).execPopulate()
    
        res.send(req.user.tasks)

 } catch (error) {
    res.status(400).send(error)
 }
    })


//Get One Task By ID
    router.get('/tasks/:id',auth ,async (req,res)=>{
    const _id = req.params.id

    try {

        //We are finding the task by task id and it allows only when login user = request owner
        const task = await Tasks.findOne({_id,owner:req.user._id})

        if(!task){
            res.status(404).send('Not found')
        }
        
        res.send(task)

    } catch (error) {
        
    }
})




//Update task
router.patch('/tasks/:id', auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['todo','isDone']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }

    try {
        //Old code
       // const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new : true , runValidators : true})
        

       const task = await Tasks.findOne({_id:req.params.id,owner:req.user._id})


        if(!task){
         return   res.status(404).send()
        }

        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }


})



//Delete Task
router.delete('/tasks/:id',auth ,async(req , res)=>{
    try {
        //Old code
        //const task = await Tasks.findByIdAndDelete(req.params.id)

        const task = await Tasks.findByIdAndDelete({_id:req.params.id,owner:req.user._id})

        if(!task){ 
         res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router