const mongoose =  require('mongoose');

 const commentSchema = new mongoose.Schema({
    comment : {
        type: String,
        required:true
    },
    creatorName : {
        type: String,
        required:true
    },
    creatorId : {
        type: mongoose.Schema.Types.ObjectId,
    },
    issueId : {
        type: mongoose.Schema.Types.ObjectId,
    },
    date:{
        type:String,
        
    },
   }, {
    timestamps: true
});

module.exports = mongoose.models.Comment || mongoose.model('Comment',commentSchema);

// const Issue =  mongoose.model('Issue', IssueSchema)

// module.exports = Issue