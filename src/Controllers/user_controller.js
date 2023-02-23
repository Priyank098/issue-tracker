const { TokenExpiredError } = require("jsonwebtoken")
const Issue = require("../Models/issue")
const User = require("../Models/user")
const Status = require("../utils/Status")

const Login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password)
            throw new Error("Email or password should be valid", {
                cause: { status: 400 }
            })
        const userFound = await User.findOne({ email });
        if (!userFound)
            throw new Error("Email not found", {
                cause: { status: 404 }
            })
        else {
            const verify = await userFound.matchPassword(password)
            if (!verify) {
                throw new Error("Passsword not match", {
                    cause: { status: 404 }
                })
            }
            await userFound.generateAuthToken()
            res.status(200).json({
                success: true,
                data: userFound
            })
        }
    } catch (error) {
        next(error)
    }
}

const createIssue = async (req, res, next) => {
    const { title, description, priority } = req.body
    try {
        if (!title || !description || !priority) {
            throw new Error("Title , Description and priority should be valid", {
                cause: { status: 400 }
            })
        }
        if (req.body.assignedTo) {
            const issue = await new Issue({
                ...req.body,
                createdBy: req.user._id,
                status: Status.values[1]
            })
            if (!await issue.save())
                throw new Error("Data not inserted")
            else{
                const assignUserData =await User.findById(req.body.assignedTo)
                const count = assignUserData.assignedCount
                const assignUser = await User.findByIdAndUpdate(req.body.assignedTo,{assignedCount:count+1}, {
                    new: true
                })
                if(!assignUser){
                    const deleteIssue = await Issue.findByIdAndDelete(issue._id)
                }else{
                    res.status(200).json({
                        sucess:true
                    })
                }
            }    
        } else {
            const issue = await new Issue({
                ...req.body,
                createdBy: req.user._id
            })
            if (!await issue.save())
                throw new Error("Data not inserted")
            else{
                res.status(200).json({
                    sucess:true
                })
            }    
        }
    } catch (error) {
        next(error)
    }
}


const updateIssue = async (req, res, next) => {
    try {
        const _id = req.params.id
        const updateIssue = await Issue.findByIdAndUpdate(_id, req.body, {
            new: true, runValidators: true
        });
        if (!updateIssue) {
            throw new Error("Data not updated Please try again later", {
                cause: { status: 404 }
            })
        } else {
            res.status(200).json({
                success: true,
                data: updateIssue
            })
        }
    } catch (error) {
        next(error)
    }
}

const getIssue = async (req, res, next) => {
    try {
        const issueData = await Issue.find().populate("createdBy")
        if (!issueData) {
            throw new Error("no data found", {
                cause: { status: 404 }
            })
        }

        res.status(200).json(issueData)
    } catch (error) {
        next(error)
    }
}

const getIssueById = async (req, res, next) => {

    try {
        const issueData = await Issue.findById(req.params.id).populate("createdBy")
        if (!issueData) {
            throw new Error("no data found", {
                cause: { status: 404 }
            })
        }

        res.status(200).json(issueData)
    } catch (error) {
        next(error)
    }
}
const deleteIssue = async (req, res, next) => {
    try {
        const _id = req.params.id
        const deleteIssue = await Issue.findByIdAndDelete(_id);
        if (!deleteIssue) {
            throw new Error("Data not delete Please try again later", {
                cause: { status: 404 }
            })
        } else {
            res.status(200).json({
                success: true,
                data: updateIssue
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { Login, createIssue, updateIssue, getIssue, getIssueById, deleteIssue }