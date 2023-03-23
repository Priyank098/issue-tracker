const mongoose =  require('mongoose');
const Status = require("../utils/status")
const Priority = require("../utils/priority")
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
        ref: 'Users'
    },
    priority : {
        type: String,
        enum :Priority,
        required: "Choose any one of them --- Low Medium High."
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    status : {
        type: String,
        enum: Status,
        default: Status.values[0]
    },
    date:{
        type:String,  
    },
   }, {
    timestamps: true
});

module.exports = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);

// const Issue =  mongoose.model('Issue', IssueSchema)

// module.exports = Issue