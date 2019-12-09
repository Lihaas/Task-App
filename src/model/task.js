const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    todo:{
        type:String,
        required:true,
        trim:true
    },
    isDone:{
         type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps:true
})

const Task = mongoose.model('task',TaskSchema)

module.exports = Task