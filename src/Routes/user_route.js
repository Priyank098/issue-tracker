const express = require('express')
const router = new express.Router()
const userController = require("../controllers/user_controller")
const {auth,verifyUser,isAssigned} = require("../middleware/auth")
//login
router.post('/login',userController.Login) 

//create user 
router.post('/createIssue',auth,userController.createIssue)

//update Issue 
router.patch('/updateIssue/:id',auth,verifyUser,userController.updateIssue)

//delete Issue 
router.delete('/deleteIssue/:id',auth,verifyUser,userController.deleteIssue)

//view Issue by userid
router.get('/viewIssueById/:id',auth,userController.getIssueById)

//view all issue 
router.get('/viewIssue',auth,userController.getIssue)

//assign issue to user 
router.post('/assignIssue',auth,userController.assignIssue)

//assign issue to user 
router.post('/updateStatus',auth,isAssigned,userController.updateStatus)

//get count of issue data status wise 
router.get('/statusFilterCount',auth,userController.statusFilterCount)

//get count of issue data status wise 
router.post('/logout',auth,userController.logout)



module.exports = router;