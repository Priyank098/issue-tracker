
const User = require("../models/user")

const createUser = async(req,res) =>{
    try {
        const user = await User.create(req.body)
        res.status(201).json(user)
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
}

const getuser = async (req, res, next) => {
    try {
        const userData = await User.find()
        if (!userData) {
            throw new Error("no data found", {
                cause: { status: 404 }
            })
        }

        res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

module.exports= {createUser,getuser}