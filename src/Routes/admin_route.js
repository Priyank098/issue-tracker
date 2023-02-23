const express = require('express')
const router = new express.Router()
const {createUser} = require("../controllers/admin_controller")


router.post('/createUser',createUser)



module.exports = router;