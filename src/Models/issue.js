const mongoose =  require('mongoose');
const Status = require("../utils/Status")
const Priority = require("../utils/Priority")
 const IssueSchema = new mongoose.Schema({
    title : {
        type: String,
        required:true
    },
    description : {
        type: String,
        required:true
    },
    assignedTo : {
        type: mongoose.Schema.Types.ObjectId,
    },
    priority : {
        type: String,
        enum :Priority,
        required: true,
        default:Priority.LOW
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    status : {
        type: String,
        enum:Status,
        default: Status.unAssigned
    },
   }, {
    timestamps: true
});

// IssueSchema.methods.toJSON = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.token

//     return userObject
// }

const Issue = new mongoose.model('Issue', IssueSchema)

module.exports = Issue