const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
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

    } catch (error) {
        next(error)
    }
}

module.exports = auth