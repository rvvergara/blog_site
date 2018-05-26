const   Post        =   require("../models/post"),
        Comment     =   require("../models/comment"),
        authObj     =   {
                            isLogged:       isLogged,
                            isPostOwner:    isPostOwner,
                            isCommentOwner: isCommentOwner,
                        };
// Log-in gate -> Only allow logged users to proceed, else direct to log in page
function isLogged(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}                        
// Check if user is author of Post
function isPostOwner(req,res,next){
    Post.findById(req.params.id,function(err,foundPost){
        if(err) res.redirect("back")
        else{
            if(foundPost.author.id.equals(req.user._id)){
                next();
            }else{
                res.redirect("back");
            }
        }
    });
}
// Check if user is author of Post
function isCommentOwner(req,res,next){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err) res.redirect("back")
        else{
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                res.redirect("back");
            }
        }
    });
}

module.exports  = authObj;