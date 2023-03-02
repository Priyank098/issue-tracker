const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const issue = require("./issue")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    assignedCount: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
    },
}, {
    timestamps: true
});

userSchema.virtual('issues', {
    ref: 'Issues',
    localField: '_id',
    foreignField: 'createdBy'
})

// userSchema.methods.toJSON = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.token

//     return userObject
// }

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})
userSchema.methods.updateCount = async function () {
    const user = this
    const count = await issue.count({ assignedTo: user._id })
    user.assignedCount = count;
    await user.save()
    return true
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "jidjfidjidijij")

    user.token = token
    await user.save()

    return token
}

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
module.exports = mongoose.models.Users || mongoose.model('Users', userSchema);
// module.exports =  mongoose.model('user', userSchema)

// module.exports = User