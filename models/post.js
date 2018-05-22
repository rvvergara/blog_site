// Schema and model for blog posts
const   mongoose    =   require("mongoose");

let     postSchema      = new mongoose.Schema(
    {
       title:      String,
       image:      String,
       summary:    String,
       content:    String,
       created:    {type: Date, default:  Date.now},                                                          
       edited:     {type: Date, default:  Date.now},                                                          
       comments:    [
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Comment",
                        },
                    ],
   }
);
module.exports            =   mongoose.model("Post",postSchema);

