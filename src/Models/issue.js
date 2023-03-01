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
        required: "choose any one of them --- LOW MEDIUM HIGH."
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    status : {
        type: String,
        enum:Status,
        default: Status.values[0]
    },
    date:{
        type:String,
        
    },
    comments: [{
        comment: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
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
module.exports = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);

// const Issue =  mongoose.model('Issue', IssueSchema)

// module.exports = Issue