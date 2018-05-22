// Schema and model for comments
const   mongoose    =   require("mongoose");

let     commentSchema   =   new mongoose.Schema(
    {
        author:     String,
        text:       String,
        created:    {
                        type: Date,
                        default: Date.now,
                    },    
        edited:    {
                        type: Date,
                        default: Date.now,
                    },    
    },
);

module.exports      =   mongoose.model("Comment",commentSchema);
