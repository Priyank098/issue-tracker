const express = require('express')
const router = new express.Router()
const admin_controller = require("../controllers/admin_controller")
const {auth} = require("../middleware/auth")

//create User
router.post('/createUser',auth("/createUser","post"),admin_controller.createUser)

//update User
router.patch('/updateUser/:id',auth("/updateUser/:id","patch"),admin_controller.updateUser)

// delete User 
router.delete('/deleteUser/:id',auth("/deleteUser/:id","delete"),admin_controller.deleteUser)

// view User by Userid
router.get('/viewUserById/:id',auth("/viewUserById/:id","get"),admin_controller.getUserById)

// view all User
router.get('/viewUser',admin_controller.getUser)


module.exports = router