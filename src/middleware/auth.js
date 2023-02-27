const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Issue = require("../models/issue")

const auth = async (req, res, next) => {
    try {
        if(req.body.token){
            const token = req.body.token
            const decoded = jwt.verify(token, 'jidjfidjidijij')
            // console.log(token);
            const user = await User.findOne({ _id: decoded._id, token: token })
            if (!user) {
                throw new Error("please authenticate", {
                    cause: { status: 400 }
                })
            }
            req.user = user
            next()
        }else{
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, 'jidjfidjidijij')
            // console.log(token);
            const user = await User.findOne({ _id: decoded._id, token: token })
            if (!user) {
                throw new Error("please authenticate", {
                    cause: { status: 400 }
                })
            }
            req.user = user
            next()
        }
       
    } catch (error) {
        next(error)
    }
}

const verifyUser = async (req, res, next) => {

    try {
        const issueData = await Issue.findById(req.params.id)
        if(issueData.createdBy === req.user._id){
            next()
        }else{
            throw new Error("You have no access to this issue", {
                cause: { status: 400 }
            })
        }
    } catch (error) {
        next(error)
    }
}

const isAssigned = async (req, res, next) => {

    try {
        const issueData = await Issue.findById(req.params.id)
        if(issueData.assignedTo === req.user._id){
            next()
        }else{
            throw new Error("Only assigned person can change the status of this issue", {
                cause: { status: 400 }
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {auth,verifyUser,isAssigned}