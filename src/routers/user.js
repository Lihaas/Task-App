const express = require('express')
const User = require('../model/user')
const auth = require('../middleware/auth')


const router = new express.Router()


router.post('/users', async (req,res)=>{

    const user = new User(req.body)
    
        try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }

})

// router.get('/users',auth,async (req,res)=>{

    
    
//     try {
//         const fin = await User.find({})
//         res.send(fin)
//     } catch (error) {
        
//         res.status(500).send()
//     }
// })

router.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)
    })


router.get('/users/:id',async (req,res)=>{

    const _id = req.params.id
  
  try {
      const user = await User.findById(_id)

      if(!user){
        return res.status(404).send('Page not found')
    }

    res.send(user)

  } catch (error) {
    res.status(500).send()
  }
  
})

router.post('/users/login', async (req,res)=>{

    try {
        
        const user = await User.findByCredential(req.body.email,req.body.password)

        const token = await user.generateAuthToken()


        res.send({user,token})

    } catch (e) {
        res.status(400).send()
    }

})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{

            return token.token != req.token

        })

        await req.user.save()

        res.send()
    } catch (e) {
        
        res.status(500).send()

    }
})

router.post('/users/logoutall',auth,async(req,res)=>{

    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()

    }


})

router.delete('/users/me',auth, async(req , res)=>{
    try {
         
        await req.user.remove()
        res.send(req.user)
        } catch (e) {
        res.status(500).send()
    }
})


router.patch('/users/me', auth,async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }

    try {
       
        updates.forEach((update)=>{

            req.user[update] = req.body[update]

        })
         await req.user.save()
         res.send(req.user)

    } 
    catch (e) {
        res.status(400).send(e)
    }


})


module.exports = router