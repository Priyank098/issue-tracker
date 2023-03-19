const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const User = require("../models/user")
const userController = require("../controllers/user_controller")
const { auth } = require("../middleware/auth")
const jwt = require('jsonwebtoken')
const instance = new Razorpay({
    key_id: 'rzp_test_K18lrPMCOsscMt',
    key_secret: 'u6ZSwHfgm1pgdS6fzpwoxmAs'
});

router.get('/', async (req, res, next) => {
    var options = {
        amount: 600 * 100,
        currency: 'INR',
    };
    const token = req.query.token
    console.log(token);
    const decoded = jwt.verify(token, 'jidjfidjidijij')
    const user = await User.findOne({ _id: decoded._id, token: token })
    if (!user) {
        throw new Error("please authenticate", {
            cause: { status: 400 }
        })
    }
    try {
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err);
            } else {
                console.log(order);
                res.render('checkout', { amount: order.amount, order_id: order.id, id: user._id });
            }
        });
    } catch (error) {
        next(error)
    }
});


router.post('/pay-verify', userController.verifyPayment)

module.exports = router;