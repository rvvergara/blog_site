const   express     =   require("express"),
        Post        =   require("../models/post"),
        Comment     =   require("../models/comment"),
        middleware  =   require("../middleware"),
        router      =   express.Router({mergeParams:true});


// 1. NEW COMMENTS - /posts/:id/comments/new - GET - Show comment form for specific post - Post.findByID(req.params.id,callback(err,foundPost)) 
router.get("/new",middleware.isLogged,function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err){
            req.flash("error","Cannot find post. It may have been deleted");
        }
        else res.render("comments/new",{post:foundPost});    
    });
});

// 2. CREATE COMMENT - /posts/:id/comments - POST - Create comment and redirect to post page - Post.findById(req.params.id,callback(err,foundPost))
router.post("/",middleware.isLogged,function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err){ 
            req.flash("error","Cannot find post. It may have been deleted");
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
                    req.flash("error","Cannot add comment. Try again!");
                    res.redirect("/posts/"+req.params.id);
                }
                else{
                    foundPost.comments.push(newComment);
                    foundPost.save();
                    req.flash("success","Comment successfully added!")
                    res.redirect("/posts/"+foundPost.id);
                }
            });
        }
    });
});

// 3. EDIT COMMENT - "/posts/:id/comments/:comment_id/edit" - GET - show edit form for selected comment - Comment.findById()
router.get("/:comment_id/edit",middleware.isLogged,middleware.isCommentOwner,function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err){
            req.flash("error","Cannot find post. It may have been deleted");
            res.redirect("back")}
        else{
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err){
                    req.flash("error","Cannot find comment. It may have been deleted")
                    res.redirect("back");
                }
                else res.render("comments/edit",{post:foundPost,comment:foundComment});
            });
        }
    });
});

// 4. UPDATE COMMENT - "/posts/:id/comments/:comment_id" - PUT - update comment and redirect - Comment.findByIdAndUpdate(req.params.comment_id)
router.put("/:comment_id",middleware.isLogged,middleware.isCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            req.flash("error","Cannot update comment. Please try again!");
            res.redirect("back");
        }
        else{
            req.flash("success","Successfully updated comment");
            res.redirect("/posts/"+req.params.id);}
    });
});

// 5. DELETE COMMENT - "/posts/:id/comments/:comment_id" - DELETE - delete comment and redirect - Comment.findByIdAndRemove(req.params.comment_id)
router.delete("/:comment_id",middleware.isLogged,middleware.isCommentOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Cannot find comment. It may already have been deleted")
            res.redirect("back");
        }
        else{
            req.flash("success","Comment has been deleted!");
            res.redirect("back");
        }
    });
});

module.exports  = router;

