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
        if(err) console.log(err)
        else{
            Comment.create(req.body.comment,function(err,newComment){
                if(err) console.log(err)
                else{
                    foundPost.comments.push(newComment);
                    foundPost.save();
                    res.redirect("/posts/"+foundPost.id);
                }
            });
        }
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

