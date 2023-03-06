const User = require("../models/user")
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const {sendWelcomeEmail} = require('../utils/mail')

const createUser = async (req, res, next) => {
    const { email, password, name, department } = req.body
    try {
        if (!name || !email || !password || !department) {
            throw new Error("All the fields should be valid", {
                cause: { status: 400 }
            })
        }
        if (password.trim().length < 8 || password.trim().length > 20) {
            throw new Error("password must be 8 to 20 cahracters long", {
                cause: { status: 400 }
            })
        }
        const userFound = await User.findOne({ email: email });
        if (userFound)
            throw new Error("Email already found", {
                cause: { status: 400 }
            })
        const user = await new User(req.body)
        if (!await user.save()) {
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
        res.status(200).json({ 
            success: true,
            data: viewUser
        })

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
        res.status(200).json({
            success: true,
            data: viewUserById
        })

    } catch (error) {
        next(error)
    }

}

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
            throw new Error("User not updated Please try after some time", {
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


const deleteUser = async (req, res, next) => {
    try{
            const _id = req.params.id
            const deleteUser = await User.findByIdAndDelete(_id)
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


module.exports = { createUser, getUser, getUserById, updateUser, deleteUser }