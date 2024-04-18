require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../Models/Users')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const jwtsecret = process.env.JWT_SECRET

const fetchuser = require('../middlewares/fetchuser')

router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({min:5}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({min:8})
], async (req, res)=>{
    let success = false
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        success = false
        return res.status(400).json(success, {errors:errors.array()})

    }

    let user = await User.findOne({email:req.body.email});
    if(user){
        success = false
        return res.status(404).json({success, error: 'Sorry user with same email already exists'})
    }

    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(req.body.password, salt)

    user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:pass
    })

    const data = {
        id : user.id
    }

    const authtoken = jwt.sign(data, jwtsecret)
     success = true

    console.log(authtoken)
    
    res.json({success, authtoken})   
})

router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Please enter the password').exists()
], async(req, res)=>{
    let success = false
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success, error:"Invalid credentials"})
        }
        else{
            let comparePass = await bcrypt.compare(password, user.password)
            if(!comparePass){
                success = false
                return res.status(400).json({success, error:"Invalid credentials"})
            }

            const data = {
                id : user.id
            }
        
            const authtoken = jwt.sign(data, jwtsecret)
            success = true

            // console.log(authtoken)
            
            res.json({success, authtoken}) 

        }
    } catch (error) {
        res.status(500).send("some error occured")
    }
})

router.post('/getuser', fetchuser, async(req, res)=>{
    try {
        const user = await User.findById(id).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send({error: 'Some error ouccured'})
    }
})

module.exports = router