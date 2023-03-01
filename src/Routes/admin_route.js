const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const {createUser,getUser,getUserById,updateUser,deleteUser} = require("../Controllers/admin_controller")
const bcrypt = require('bcryptjs')
const {auth} = require("../middleware/auth")
//create User
router.post('/createUser',auth("/createUser","post"),createUser)

//update User
router.patch('/updateUser/:id',auth("/updateUser/:id","patch"),updateUser)

// delete User 
router.delete('/deleteUser/:id',auth("/deleteUser/:id","delete"),deleteUser)

// view User by Userid
router.get('/viewUserById/:id',auth("/viewUserById/:id","get"),getUserById)

// view all User
router.get('/viewUser',getUser)


module.exports = router