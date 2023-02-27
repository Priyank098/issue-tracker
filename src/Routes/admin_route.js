const express = require('express')
const router = new express.Router()
const {createUser,getuser} = require("../controllers/admin_controller")


router.post('/createUser',createUser)
router.get('/getuser',getuser)



module.exports = router;