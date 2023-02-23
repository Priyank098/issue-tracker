const express = require('express')
const router = new express.Router()
const {Login,createIssue,updateIssue,getIssue,getIssueById,deleteIssue} = require("../Controllers/user_controller")
const auth = require("../middleware/auth")
//login
router.post('/login',Login) 

//create user 
router.post('/createIssue',auth,createIssue)

//update Issue 
router.patch('/updateIssue/:id',auth,updateIssue)

//delete Issue 
router.delete('/deleteIssue/:id',auth,deleteIssue)

//view Issue by userid
router.get('/viewIssueById/:id',auth,getIssueById)

//view all issue 
router.get('/viewIssue',auth,getIssue)



module.exports = router;