const express = require('express')
const router = new express.Router()
const userController = require("../controllers/user_controller")
const {auth,verifyUser,isAssigned} = require("../middleware/auth")
//login
router.post('/login',userController.Login) 

//create user 
router.post('/createIssue',auth(),userController.createIssue)

//update Issue 
router.patch('/updateIssue/:id',auth(),verifyUser,userController.updateIssue)

//view all issue 
router.get('/viewIssue',auth(),userController.getIssue)

//view Issue by userid
router.get('/viewIssueById/:id',auth(),userController.getIssueById)

//delete Issue 
router.delete('/deleteIssue/:id',auth(),verifyUser,userController.deleteIssue)

//assign issue to user 
router.post('/assignIssue',auth(),userController.assignIssue)

//update issue status 
router.patch('/updateStatus',auth(),isAssigned,userController.updateStatus)

//get count of issue data status wise 
router.get('/statusFilterCount',auth(),userController.statusFilterCount)

//logout 
router.post('/logout',auth(),userController.logout)

//view user issues
router.get('/userIssues',auth(),userController.userIssues)

//view user assigned issues
router.get('/userAssignedIssues',auth(),userController.userAssignedIssues)

//bar chart
router.get('/barChart',auth(),userController.barChart)

//add comment
router.post('/addComment',auth(),userController.addComment)

//delete comment
router.delete('/deleteComment/:id',auth(),userController.deleteComment)

//view comment
router.get('/viewComments/:id',auth(),userController.viewComments)

//count comment
router.get('/commentsCount/:id',auth(),userController.commentsCount)

//sorting Api's
router.get('/sortByDate',auth(),userController.sortByDate)
router.get('/sortBypriority',auth(),userController.sortBypriority)
router.get('/sortByStatus',auth(),userController.sortByStatus)
router.get('/sortByUpdate',auth(),userController.sortByUpdate)

//token valiadation
router.get('/isTokenValid',auth(),userController.isTokenValid)

module.exports = router;