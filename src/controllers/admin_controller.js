const User = require("../models/user")
const bcrypt = require('bcryptjs')
const crypto = require("crypto")
const Token = require("../models/token")
const bcryptSalt = process.env.BCRYPT_SALT
const mongoose = require('mongoose')
const {sendWelcomeEmail} = require('../utils/mail')
const jwt = require('jsonwebtoken')

// create user
const createUser = async (req, res, next) => {
    const { email, password, name, department } = req.body
    try {
        if (!name || !email || !password || !department) {
            throw new Error("All the fields should be valid", {
                cause: { status: 400 }
            })
        }
        if (password.trim().length < 8 || password.trim().length > 20) {
            throw new Error("Password must be 8 to 20 characters long", {
                cause: { status: 400 }
            })
        }
        const userFound = await User.findOne({ email: email });
        if (userFound)
            throw new Error("Email already exists", {
                cause: { status: 400 }
            })
        const user = await User.create(req.body)
        const token  = await user.generateAuthToken()
        console.log(token)
        sendWelcomeEmail(email,token)
        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        next(error)
    }
}

// update password 
const requestPasswordReset = async(req,res,next)=>{
    const token = req.query.token
    
    const decoded = jwt.verify(token, 'jidjfidjidijij')
    // console.log(token);
    const user = await User.findOne({ _id: decoded._id, token: token })
    if(!user){
        throw new Error("User doesn't exist!", {
            cause: { status: 400 }
        }) 
    }
    // var password = req.body.password
    const password =  await bcrypt.hash(req.body.password, 10)
    const updateUser = await User.findByIdAndUpdate(user._id, {password:password}, {
        new: true
    })
    if(!updateUser){
        throw new Error("User password not updated", {
            cause: { status: 400 }
        })
    }
    res.status(200).json({ 
        success: true,
        data: "passsword updated"
    })
}

// forget password
const forgetPassword = async(req,res,next) => {
    const email = req.body.email
    try {
       const user = await User.findOne({email: email})
       if(!user){
          throw new Error("User not exist", {
            cause: { status: 400 }
          })
       }
       const token  = await user.generateAuthToken()  
    sendWelcomeEmail(email, token)
    res.status(200).json({
        success: true,
        data: "forget password"
    })
    }catch (error){
       next(error)
    }
}

// reset password
const resetPassword = async(req,res,next) => {
    const token = req.query.token
    const {password,newPassword} = req.body
    try {
       const tokendata = await User.findOne({token: token})
       if(!tokendata){
          throw new Error("This link has been expired")
       }
       if(password !== newPassword){
        throw new Error("Password does not match Confirm password!")
       }
       if(tokendata){
        const newspassword =  await bcrypt.hash(req.body.password, 10)
        await User.findByIdAndUpdate(tokendata._id, {password:newspassword,token:"null"}, {
            new: true,
        })
        
    }
    res.status(200).json({
        success: true,
        data: "reset password",
        message: "User password has been reset"
    })
    }catch (error){
       next(error)
    }
}

// view user
const getUser = async (req, res, next) => {
    try {
        const viewUser = await User.find()
        if (!viewUser) {
            throw new Error("User not exists", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({ 
            success: true,
            data: viewUser
        })

    } catch (error) {
        next(error)
    }
}

// view single user by id
const getUserById = async (req, res, next) => {
    try {
        const viewUserById = await User.findById(req.params.id)
        if (!viewUserById) {
            throw new Error("User not exists", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({
            success: true,
            data: viewUserById
        })

    } catch (error) {
        next(error)
    }

}

// update user
const updateUser = async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'department']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const { email, name, department } = req.body
    try {
        if (!isValidOperation) {
            throw new Error("Invaid Updates", {
                cause: { status: 404 }
            })
        }
        if (!name || !email || !department) {
            throw new Error("All the fields should be valid", {
                cause: { status: 400 }
            })
        }
        const _id = req.params.id
        const updateUser = await User.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        if (!updateUser) {
            throw new Error("User not updated please try after some time", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({
            success: true,
            data: updateUser
        })
      
    } catch (error) {
        next(error)
    }
}

// delete user
const deleteUser = async (req, res, next) => {
    try{
            const deleteUser = await User.findByIdAndDelete(req.params.id)
            if (!deleteUser) {
                throw new Error("User not deleted", {
                    cause: { status: 404 }
                })
            }
            res.status(200).json({
                success: true,
                data: deleteUser
            })
          
    } catch (error) {
        console.log(error)
        next(error)
    }
}


module.exports = { createUser , getUser , getUserById , updateUser , deleteUser , requestPasswordReset , forgetPassword ,resetPassword }