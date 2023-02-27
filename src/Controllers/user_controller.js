const Issue = require("../models/issue")
const User = require("../models/user")
const { validatingFields, update_issue, update_issue_helper } = require("../services/user.services")
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
        validatingFields(title, description, priority)
        if (req.body.assignedTo) {
            const assignUserData = await User.findById(req.body.assignedTo)
            const issue = await new Issue({
                ...req.body,
                createdBy: req.user._id,
                status: Status.values[1]
            })
            if (!await issue.save())
                throw new Error("Data not inserted")
            else {
                assignUserData.updateCount()
                res.status(200).json({
                    sucess: true,
                    data: issue
                })
            }
        } else {
            const issue = await new Issue({
                ...req.body,
                createdBy: req.user._id
            })
            if (!await issue.save())
                throw new Error("Data not inserted")
            else {
                res.status(200).json({
                    sucess: true,
                    data: issue
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

const updateIssue = async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'priority', 'assignedTo']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        throw new Error("Invaid Updates", {
            cause: { status: 404 }
        })
    }
    const { title, description, priority } = req.body

    try {
        if (req.body.assignedTo) {
            const issueData = await Issue.findById(req.params.id)
            const assignUserData = await User.findById(req.body.assignedTo)
            if (issueData.status === Status.values[0]) {
                validatingFields(title, description, priority)
                update_issue(req, res, Issue, assignUserData, "", Status)
            } else if (issueData.status === Status.values[1]) {
                if (issueData.assignedTo == req.body.assignedTo) {
                    validatingFields(title, description, priority)
                    update_issue(req, res, Issue, "", "", "")
                } else {
                    const previousAssignUserData = await User.findById(issueData.assignedTo)
                    validatingFields(title, description, priority)
                    update_issue(req, res, Issue, assignUserData, previousAssignUserData, "")
                }
            }
        } else {
            validatingFields(title, description, priority)
            update_issue(req, res, Issue, "", "", "")
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
        res.status(200).json({
            success: true,
            data: issueData
        })
    } catch (error) {
        next(error)
    }
}

const getIssueById = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw new Error("Id should be valid", {
                cause: { status: 404 }
            })
        }
        const issueData = await Issue.findById(req.params.id).populate("createdBy")
        if (!issueData) {
            throw new Error("no data found", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({
            success: true,
            data: issueData
        })
    } catch (error) {
        next(error)
    }
}

const deleteIssue = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw new Error("Id should be valid", {
                cause: { status: 404 }
            })
        }
        const deleteIssue = await Issue.findByIdAndDelete(req.params.id);
        const assignUserData = await User.findById(deleteIssue.assignedTo)
        assignUserData.updateCount()
        if (!deleteIssue) {
            throw new Error("Data not delete Please try again later", {
                cause: { status: 404 }
            })
        } else {
            res.status(200).json({
                success: true,
                data: deleteIssue
            })
        }
    } catch (error) {
        next(error)
    }
}

const assignIssue = async (req, res, next) => {
    try {
        const { _id, assignedTo } = req.body
        if (!_id || !assignedTo) {
            throw new Error("Assigned person Id should be valid", {
                cause: { status: 404 }
            })
        }
        const issueData = await Issue.findById(_id)
        const assignUserData = await User.findById(assignedTo)
        if (issueData.status === Status.values[0]) {
            const updateIssue = await Issue.findByIdAndUpdate(_id, { assignedTo: assignedTo, status: Status.values[1] }, {
                new: true, runValidators: true
            });
            await assignUserData.updateCount()
            update_issue_helper(updateIssue, res)
        } else if (issueData.status === Status.values[1]) {
            if (issueData.assignedTo == req.body.assignedTo) {
                throw new Error("Issue Already Assigned to this person.Please try different User", {
                    cause: { status: 404 }
                })
            } else {
                const previousAssignUserData = await User.findById(issueData.assignedTo)
                const updateIssue = await Issue.findByIdAndUpdate(_id, { assignedTo: assignedTo }, {
                    new: true, runValidators: true
                });
                await previousAssignUserData.updateCount()
                await assignUserData.updateCount()
                update_issue_helper(updateIssue, res)
            }
        }
    } catch (error) {
        next(error)
    }
}

const updateStatus = async (req, res, next) => {
    try {
        const { _id } = req.body
        const issueData = await Issue.findById(_id)

    } catch (error) {

    }
}

const statusFilterCount = async (req, res, next) => {
    let unAssignedCount=0, assignedCount=0, inProgressCount=0, completedCount=0
    
    try {
        const allIssuesop = await Issue.find({createdAt: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
        }})
        const allIssues = await Issue.find()
        allIssues.map((issue) => {
            console.log(issue.status);
            if (issue.status == Status.values[0])
                unAssignedCount += 1
            else if (issue.status == Status.values[1])
                assignedCount += 1
            else if (issue.status == Status.values[2])
                inProgressCount += 1
            else if (issue.status == Status.values[3])
                completedCount += 1
        })
        res.status(201).json({
            success: true,
            mainData:allIssuesop,
            data: {
                unAssignedCount: unAssignedCount,
                assignedCount: assignedCount,
                inProgressCount: inProgressCount,
                completedCount: completedCount
            }
        })
    } catch (error) {
        next(error)
    }
}

const logout = async(req,res,next) =>{
    try {
        req.user.token = ""
        if(!await req.user.save()){
            throw new Error("something went wrong please try again later")
        }
        res.status(200).json({
            success:true
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { Login, createIssue, updateIssue, getIssue, getIssueById, deleteIssue, assignIssue, updateStatus, statusFilterCount,logout }