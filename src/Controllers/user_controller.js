const { TokenExpiredError } = require("jsonwebtoken")
const Issue = require("../Models/issue")
const User = require("../Models/user")

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
    const issue = await new Issue({
        ...req.body,
        createdBy: req.user._id
    })
    try {
        if (!await issue.save())
            throw new Error("Data not inserted")

        res.status(200).json(issue)
    } catch (error) {
        next(error)
    }
}


const updateIssue = async (req, res, next) => {
    try {
        const _id = req.params.id
        const updateIssue = await Issue.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        if (!updateIssue) {
            throw new Error("Data not updated Please try again later", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({
            success: true,
        })
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

}

module.exports = { Login, createIssue, updateIssue, getIssue, getIssueById, deleteIssue }