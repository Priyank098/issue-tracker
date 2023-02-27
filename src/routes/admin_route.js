const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const {createUser,getUser,getUserById,updateUser,deleteUser} = require("../controllers/admin_controller")
const bcrypt = require('bcryptjs')

//create User
router.post('/createUser',createUser)

//update User
router.patch('/updateUser/:id',updateUser)

// delete User 
router.delete('/deleteUser/:id',deleteUser)

// view User by Userid
router.get('/viewUserById/:id',getUserById)

// view all User
router.get('/viewUser',getUser)


module.exports = router