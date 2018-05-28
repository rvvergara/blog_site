const   express     =   require("express"),
        Post        =   require("../models/post"),
        middleware  =   require("../middleware"),
        router      =   express.Router();

// 1. INDEX - /posts/ - GET - list all posts - Post.find() 
router.get("/",function(req,res){
    Post.find({},function(err,posts){
        if(err){
            req.flash("error","Cannot load posts at the moment")
             console.log(err);
            }
        else    res.render("posts/index",{posts:posts});
    });
});

// 2. NEW - /posts/new - GET - show new post form - NA
router.get("/new",middleware.isLogged,function(req,res){
    res.render("posts/new");
});

// 3. CREATE - /posts - POST - Create new post and redirect somewhere - Post.create()

router.post("/",middleware.isLogged,function(req,res){
    // req.body.content = req.sanitize(req.body.content);
    let postToAdd           =   req.body.post;
        postToAdd.author    =   {
                                id: req.user._id,
                                username: req.user.username,
                                };
    Post.create(postToAdd,function(err,newPost){
        if(err){
            req.flash("error","Error encountered while creating post. Please try again");
            res.redirect("/posts/new");
        }
        else{
            req.flash("success","Successfully created blog post!"); 
            res.redirect("/posts/"+newPost.id);
        }
    });
});

module.exports  = router;