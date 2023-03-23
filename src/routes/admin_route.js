const express = require('express')
const router = new express.Router()
const admin_controller = require("../controllers/admin_controller")
const {auth} = require("../middleware/auth")

//create User
router.post('/createUser',auth("/createUser","post"),admin_controller.createUser)

//updatePassword 
router.post('/update-password',admin_controller.requestPasswordReset )

//forgetPassword 
router.post('/forget-password',admin_controller.forgetPassword)

//resetPassword 
router.post('/reset-password',admin_controller.resetPassword)

//update User
router.patch('/updateUser/:id',auth("/updateUser/:id","patch"),admin_controller.updateUser)

// delete User 
router.delete('/deleteUser/:id',auth("/deleteUser/:id","delete"),admin_controller.deleteUser)

// view User by Userid
router.get('/viewUserById/:id',auth("/viewUserById/:id","get"),admin_controller.getUserById)

// view all User
router.get('/viewUser',auth(),admin_controller.getUser)


module.exports = router