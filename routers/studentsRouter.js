const express = require('express')
const studentModel = require('../models/studentModel')
const studentsRouter = express.Router()
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const isUserAuthorized = require('../middleware/middleWare')

studentsRouter.post('/signup',async(req,res)=>{
    const{username,password}=req.body
    existingUser =await studentModel.findOne({username:username}).exec()
    if(existingUser){
        res.json({
            error:"Error! username aldready exists"
        })
    }else{
        const hash =bcrypt.hashSync(password,10)
        const newStudent = new studentModel({
            username:username,
            passwordHash:hash
        })
        await newStudent.save()
        res.json({
            message:"User Created"
        })
    }
})


studentsRouter.post('/signin',async(req,res)=>{
    const {username,password}=req.body
    existingUser= await studentModel.findOne({username}).exec()
    if(!existingUser){
        res.json({
            error:"Error! Username does not exist"
        })
    }else{
        const isPasswordMatch = bcrypt.compareSync(password,existingUser.passwordHash)
        if(!isPasswordMatch){
            res.json({
                error:"Error! Invalid Password"
            })
        }else{
            const token =jwt.sign({
                userId:existingUser._id,
                username:existingUser.username
            },'s3cret')
            res.set('authorization',token)
            res.json({
                message:"Sign in successful"
            })
        }
    }
})


studentsRouter.get('/user',isUserAuthorized,async(req,res)=>{
    const {userId,username} =req.currentUser
    res.json({
        userId:userId,
        username:username
    })
})

studentsRouter.get('/others',isUserAuthorized,async(req,res)=>{
    const allStudents = await studentModel.find().exec()
    const otherStudents = allStudents.filter((student)=>{
        return student._id.toString()!== req.currentUser.userId
    })
    const otherStudentDetails =otherStudents.map((student)=>{
        return {
            userId:student._id,
            username:student.username
        }
    })
    res.json(otherStudentDetails)
})

module.exports= studentsRouter