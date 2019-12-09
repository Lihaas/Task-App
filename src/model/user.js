const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../model/task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error('Enter a valid email')
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                 throw new Error('Age must greater then 0')
            }
        }

    },
    password:{

        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
           
         if(value.toLowerCase().includes('password')){
                throw new Error('Change your password')
            } }
          },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]    
},{
    timestamps:true
})

//Conneting task and user virtualy

userSchema.virtual('tasks', {
    ref: Task,
    localField: '_id',
    foreignField: 'owner'
})



//Hiding Data

userSchema.methods.toJSON = function () {
    
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}



userSchema.statics.findByCredential = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to find')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw  new Error('Unable to login')
    }

    return user

}


userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({_id:user._id.toString()},'1q1q2w')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}


userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){

        user.password = await bcrypt.hash(user.password,8)

    }

    next()
})


userSchema.pre('remove',async function (next) {

    const user = this
    await Task.deleteMany({owner:user._id})
    next()
    
})



const User = mongoose.model('User',userSchema)



module.exports = User