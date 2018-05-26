const   express     =   require("express"),
        Post        =   require("../models/post"),
        Comment     =   require("../models/comment"),
        router      =   express.Router({mergeParams:true});


// 1. NEW COMMENTS - /posts/:id/comments/new - GET - Show comment form for specific post - Post.findByID(req.params.id,callback(err,foundPost)) 
router.get("/new",isLogged,function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err) console.log(err)
        else res.render("comments/new",{post:foundPost});    
    });
});

// 2. CREATE COMMENT - /posts/:id/comments - POST - Create comment and redirect to post page - Post.findById(req.params.id,callback(err,foundPost))
router.post("/",function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err){ 
            console.log(err);
            res.redirect("/posts/"+req.params.id+"/comments/new");
        }
        else{
            let comment         =   req.body.comment;
                comment.author  =   {
                                        id: req.user._id,
                                        username: req.user.username,
                                    };
            Comment.create(comment,function(err,newComment){
                if(err){ 
                    console.log(err);
                    res.redirect("/posts/"+req.params.id);
                }
                else{
                    foundPost.comments.push(newComment);
                    foundPost.save();
                    res.redirect("/posts/"+foundPost.id);
                }
            });
        }
    });
});

// 3. EDIT COMMENT - "/posts/:id/comments/:comment_id/edit" - GET - show edit form for selected comment - Comment.findById()
router.get("/:comment_id/edit",function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err) res.redirect("back")
        else{
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err) res.redirect("back")
                else res.render("comments/edit",{post:foundPost,comment:foundComment});
            });
        }
    });
});

// 4. UPDATE COMMENT - "/posts/:id/comments/:comment_id" - PUT - update comment and redirect - Comment.findByIdAndUpdate(req.params.comment_id)
router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err) res.redirect("back")
        else res.redirect("/posts/"+req.params.id);
    });
});

// 5. DELETE COMMENT - "/posts/:id/comments/:comment_id" - DELETE - delete comment and redirect - Comment.findByIdAndRemove(req.params.comment_id)
router.delete("/:comment_id",function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err) res.redirect("back")
        else res.redirect("back");
    });
});

// Middleware to show route only to logged users
function    isLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports  = router;

