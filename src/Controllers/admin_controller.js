
const User = require("../Models/user")

const createUser = async(req,res) =>{
    try {
        const user = await User.create(req.body)
        res.status(201).json(user)
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
}

module.exports= {createUser}