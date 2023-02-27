const User = require("../models/user")
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const createUser =  async (req,res,next) => {
    //const {email} = req.body
    try{ 
        const userFound = await User.findOne({ email: req.body.email });
        if (userFound)
            throw new Error("Email already found", {
                cause: { status: 400 }
            })
            const user = await new User(req.body)
         if (!await user.save()){
          throw new Error("User not created")
         }
        res.status(200).json(user)

       } catch (error) {
          next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const viewUser = await User.find()
        if (!viewUser) {
            throw new Error("user not found", {
                cause: { status: 404 }
            })
        }
        res.status(200).json(viewUser)

    } catch (error) {
        next(error)
    }

}

const getUserById = async (req, res, next) => {
    try {
        const viewUserById = await User.findById(req.params.id)
        if (!viewUserById) {
            throw new Error("user not found", {
                cause: { status: 404 }
            })
        }
        res.status(200).json(viewUserById)

    } catch (error) {
        next(error)
    }

}

const updateUser = async (req, res, next) => {
    try{
        const _id = req.params.id
        const updateUser = await User.findByIdAndUpdate(_id, req.body,{
            new: true
        })
        if (!updateUser) {
            throw new Error("User not updated Please try after some time", {
                cause: { status: 404 }
            })
        }
        res.status(200).json(updateUser)
      
    } catch (error) {
        next(error)
    }
}


const deleteUser = async (req, res, next) => {
    try{
            const _id = req.params.id
            const deleteUser = await User.findByIdAndDelete(_id)
            if (!deleteUser) {
                throw new Error("User not deleted", {
                    cause: { status: 404 }
                })
            }
            res.status(200).json(deleteUser)
          
    } catch (error) {
            console.log(error)
            next(error)
    }
 }
    
        
            
module.exports= {createUser, getUser, getUserById, updateUser, deleteUser}