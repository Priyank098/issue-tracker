const issue = require("../models/issue")
const Issue = require("../models/issue")
const User = require("../models/user")
const Comment = require("../models/comment")
const { validatingFields, update_issue, update_issue_helper } = require("../services/user.services")
const Status = require("../utils/status")

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
    const date = new Date()
    try {
        validatingFields(title, description, priority)
        if (req.body.assignedTo) {
            const assignUserData = await User.findById(req.body.assignedTo)
            const issue = await new Issue({
                ...req.body,
                createdBy: req.user._id,
                date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
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
                createdBy: req.user._id,
                date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
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
            } else if (issueData.status === Status.values[1] || issueData.status === Status.values[2]) {
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
        const issueData = await Issue.find().populate("createdBy").populate("assignedTo")
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
        const issueData = await Issue.findById(req.params.id).populate("createdBy").populate("assignedTo")
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
        const IssueData = await Issue.findById(req.params.id)
        if (IssueData.status == Status.values[0]) {
            const deleteIssue = await Issue.findByIdAndDelete(req.params.id);
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
        } else {
            const deleteIssue = await Issue.findByIdAndDelete(req.params.id);
            const deleteComment = await Comment.remove({ issueId: req.params.id })
            const assignUserData = await User.findById(deleteIssue.assignedTo)

            // console.log(assignUserData);
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
        } else if (issueData.status === Status.values[1] || issueData.status === Status.values[2]) {
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
        if (!Status.values.includes(req.body.status)) {
            throw new Error("Choose only from them 'unAssigned','NotStarted','inProgress','Completed'", {
                cause: { status: 404 }
            })
        }
        if (req.body.status == Status.values[0]) {
            const issueData = await Issue.findById(req.body._id)
            const userData = await User.findById(issueData.assignedTo)
            const updateIssue = await Issue.findByIdAndUpdate(req.body._id, { assignedTo: null, status: req.body.status }, {
                new: true, runValidators: true
            });
            userData.updateCount()
            update_issue_helper(updateIssue, res)
        }
        else {
            const updateIssue = await Issue.findByIdAndUpdate(req.body._id, { status: req.body.status }, {
                new: true, runValidators: true
            });
            update_issue_helper(updateIssue, res)
        }

    } catch (error) {
        next(error)
    }
}

const statusFilterCount = async (req, res, next) => {
    let unAssignedCount = 0, assignedCount = 0, inProgressCount = 0, completedCount = 0

    try {

        const allIssues = await Issue.find()
        allIssues.map((issue) => {
            // console.log(issue.status);
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

const logout = async (req, res, next) => {
    try {
        req.user.token = ""
        if (!await req.user.save()) {
            throw new Error("something went wrong please try again later")
        }
        res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

const userIssues = async (req, res, next) => {
    try {
        const issues = await Issue.find({ createdBy: req.user._id }).populate("createdBy").populate("assignedTo")
        if (!issues) {
            throw new Error("something went wrong please try again later", {
                cause: { status: 404 }
            })
        }
        else {
            res.status(201).json({
                success: true,
                data: issues
            })
        }
    } catch (error) {
        next(error)
    }
}

const userAssignedIssues = async (req, res, next) => {
    try {
        const issues = await Issue.find({ assignedTo: req.user._id }).populate("createdBy").populate("assignedTo")
        if (!issues) {
            throw new Error("something went wrong please try again later", {
                cause: { status: 404 }
            })
        }
        else {
            res.status(201).json({
                success: true,
                data: issues
            })
        }
    } catch (error) {
        next(error)
    }
}

const barChart = async (req, res, next) => {
    var dayWiseData = {
        day1: 0,
        day2: 0,
        day3: 0,
        day4: 0,
        day5: 0,
        day6: 0,
        day7: 0,
    }
    const myKeys = Object.keys(dayWiseData)
    // console.log(dayWiseData);
    try {
        // const allIssues = await Issue.aggregate([
        //     { $match: { createdAt: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) } } },
        //     { $group: { _id: "$date", count: { $sum: 1 }, data: { $push: { id: "$_id", date: "$date" } } } }
        // ])
        const allIssues = await Issue.aggregate([
            { $match: { createdAt: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) } } },
            { $group: { _id: "$date", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ])

        for (var i = 0; i < allIssues.length; i++) {
            dayWiseData[myKeys[i]] = allIssues[i].count
        }

        res.status(200).json({
            success: true,
            data: dayWiseData
        })
    } catch (error) {
        next(error)
    }
}

const addComment = async (req, res, next) => {
    const { issueId, comment } = req.body;
    const { _id, name } = req.user
    const date = new Date()

    try {
        const commentData = await new Comment({ comment: comment, creatorName: name, creatorId: _id, issueId: issueId, date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, })

        if (await commentData.save()) {
            res.status(200).json({
                success: true,
                data: commentData
            })
        } else {
            throw new Error("something went wrong please try again later")
        }
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    const id = req.params.id;
    const { _id } = req.user
    try {
        const comment = await Comment.findById(id)
        if (comment.creatorId.toString() == _id.toString()) {
            const commentData = await Comment.findByIdAndDelete(id)

            if (commentData) {
                res.status(200).json({
                    success: true,
                    data: commentData
                })
            } else {
                throw new Error("something went wrong please try again later")
            }
        } else {
            throw new Error("You have no access to delete this issue..", {
                cause: { status: 400 }
            })
        }
    } catch (error) {
        next(error)
    }
}
const isTokenValid = async (req, res, next) => {
    res.status(200).json({ success: true })
}

const viewComments = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw new Error("Id should be valid", {
                cause: { status: 404 }
            })
        }
        const commentData = await Comment.find({ issueId: req.params.id })
        if (!commentData) {
            throw new Error("no data found", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({
            success: true,
            data: commentData
        })
    } catch (error) {
        next(error)
    }
}

const commentsCount = async (req, res, next) => {
    try {
        if (!req.params.id) {
            throw new Error("Id should be valid", {
                cause: { status: 404 }
            })
        }
        const commentData = await Comment.countDocuments({ issueId: req.params.id })
        res.status(200).json({
            success: true,
            data: commentData
        })
    } catch (error) {
        next(error)
    }
}

const sortByDate = async (req, res, next) => {
    try {
        const sortByDate = await Issue.aggregate([
            { $sort: { createdAt: -1 } }
        ])

        res.status(200).json({
            success: true,
            data: sortByDate
        })
    } catch (error) {
        next(error)
    }
}

const sortByUpdate = async (req, res, next) => {
    try {
        const sortByUpdate = await Issue.aggregate([
            { $sort: { updatedAt: -1 } }
        ])

        res.status(200).json({
            success: true,
            data: sortByUpdate
        })
    } catch (error) {
        next(error)
    }
}
const sortBypriority = async (req, res, next) => {
    try {
        const sortByPriority = await Issue.aggregate([{
            $addFields: {
                sortPriority: {
                    $switch: {
                        branches: [
                            {
                                'case': {
                                    $eq: [
                                        '$priority',
                                        'HIGH'
                                    ]
                                },
                                then: 3
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$priority',
                                        'MEDIUM'
                                    ]
                                },
                                then: 2
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$priority',
                                        'LOW'
                                    ]
                                },
                                then: 1
                            }
                        ],
                        'default': 0
                    }
                }
            }
        }, {
            $sort: {
                sortPriority: -1
            }
        }])
        res.status(200).json({
            success: true,
            data: sortByPriority
        })
    } catch (error) {
        next(error)
    }
}

const sortByStatus = async (req, res, next) => {
    try {
        const sortByStatus = await Issue.aggregate([{
            $addFields: {
                sortStatus: {
                    $switch: {
                        branches: [
                            {
                                'case': {
                                    $eq: [
                                        '$status',
                                        'Completed'
                                    ]
                                },
                                then: 4
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$status',
                                        'inProgress'
                                    ]
                                },
                                then: 3
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$status',
                                        'Assigned'
                                    ]
                                },
                                then: 2
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$status',
                                        'unAssigned'
                                    ]
                                },
                                then: 1
                            }
                        ],
                        'default': 0
                    }
                }
            }
        }, {
            $sort: {
                sortStatus: -1
            }
        }])
        res.status(200).json({
            success: true,
            data: sortByStatus
        })
    } catch (error) {
        next(error)
    }
}

const verifyPayment = async (req, res, next) => {
    try {
        body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
        var crypto = require("crypto");
console.log(req.body);

        var expectedSignature = crypto.createHmac('sha256', 'u6ZSwHfgm1pgdS6fzpwoxmAs')
            .update(body.toString())
            .digest('hex');
        // console.log("sig"+req.body.razorpay_signature);
        // console.log("sig"+expectedSignature);

        if (expectedSignature === req.body.razorpay_signature) {
            const updateUser = await User.findByIdAndUpdate(req.body.id, {isPremium:true} ,{
                new: true, runValidators: true
            });
            if(updateUser){
                res.status(200).json({
                    success: true,
                    data: updateUser
                })
            }
            
            console.log("Payment Success");
            
        } else {
            console.log("Payment Fail");
        }
    } catch (error) {
        next(error)
    }
}
module.exports = { Login, createIssue, updateIssue, getIssue, getIssueById, deleteIssue, assignIssue, updateStatus, statusFilterCount, logout, userAssignedIssues, userIssues, barChart, addComment, isTokenValid, deleteComment, viewComments, commentsCount, sortByDate, sortBypriority, sortByStatus, sortByUpdate, verifyPayment }