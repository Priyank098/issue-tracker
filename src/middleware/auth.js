const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Issue = require("../models/issue")
const { adminRoles } = require("../utils/Roles")

const auth = (url = "", method = "") => {
    return (async (req, res, next) => {
        try {
            if (req.body.token) {
                const token = req.body.token
                const decoded = jwt.verify(token, 'jidjfidjidijij')
                // console.log(token);
                const user = await User.findOne({ _id: decoded._id, token: token })
                if (!user) {
                    throw new Error("please authenticate", {
                        cause: { status: 400 }
                    })
                }
                if (url && method) {
                    if (adminRoles.some(admin => admin.method === method && admin.url === url)) {
                        if (user.isAdmin == true) {
                            req.user = user;
                            next()
                        } else {
                            throw new Error("Access Denied!!", {
                                cause: { status: 400 }
                            });
                        }
                    }
                }
                else {
                    req.user = user;
                    next()
                }
            } else {
                const token = req.header('Authorization').replace('Bearer ', '')
                const decoded = jwt.verify(token, 'jidjfidjidijij')
                const user = await User.findOne({ _id: decoded._id, token: token })
                if (!user) {
                    throw new Error("please authenticate", {
                        cause: { status: 400 }
                    })
                }
                if (url && method) {
                    if (adminRoles.some(admin => admin.method === method && admin.url === url)) {
                        if (user.isAdmin == true) {
                            req.user = user;
                            next()
                        } else {
                            throw new Error("Access Denied!!", {
                                cause: { status: 400 }
                            });
                        }
                    }
                }
                else {
                    req.user = user;
                    next()
                }
            }
        } catch (error) {
            next(error)
        }
    })
}

const verifyUser = async (req, res, next) => {

    try {
        console.log(req.user._id);
        const issueData = await Issue.findById(req.params.id)
        console.log(issueData);
        if (issueData.createdBy.toString() === req.user._id.toString()) {
            next()
        } else {
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
        const issueData = await Issue.findById(req.body._id)
        if (issueData.assignedTo.toString() === req.user._id.toString()) {
            next()
        } else {
            throw new Error("Only assigned person can change the status of this issue", {
                cause: { status: 400 }
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { auth, verifyUser, isAssigned }