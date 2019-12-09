require('../src/db/mongoose')

const Task = require('../src/model/task')


// Task.findByIdAndDelete('5db9c21b54ec1c39a4718351').then(()=>{


//     return Task.countDocuments({isDone:false})

// }).then((result)=>{
//     console.log(result);
    
// }).catch((e)=>{

//     console.log(e);
    
// })

const findIdandDelet = async (id) =>{

    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({isDone : false})
    
    return count
 
}

findIdandDelet('5db9c8b9ddb49d2348246791').then((result)=>{

console.log(result);


}).catch((e)=>{
    console.log(e);
    
})