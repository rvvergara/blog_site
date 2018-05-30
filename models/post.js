// Schema and model for blog posts
const   mongoose    =   require("mongoose");

let     postSchema      = new mongoose.Schema(
    {
       title:      String,
       author:      {
                        id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User",
                        },
                        username: String,
                    },
       image:      {type: String, default:"https://picsum.photos/458/354?image=1062"},
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

