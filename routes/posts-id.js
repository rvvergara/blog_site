const   express     =   require("express"),
        Post        =   require("../models/post"),
        middleware  =   require("../middleware"),
        router      =   express.Router({mergeParams:true});

// 1. SHOW - /posts/:id - GET - show details of clicked post - Post.findByID()
router.get("/",function(req,res){

    Post.findById(req.params.id).populate("comments").exec(function(err,clickedPost){
        if(err){
            req.flash("error","Cannot find post you were looking for!");
            res.redirect("/posts");
        }
        else res.render("posts/show",{post:clickedPost});
    });
});

// 2. EDIT - /posts/:id/edit - GET - show edit form for clicked post - Post.findByIdAndUpdate()

router.get("/edit",middleware.isLogged,middleware.isPostOwner,function(req,res){
    Post.findById(req.params.id,function(err,postForEdit){
        if(err){
            req.flash("error","Cannot find post");
             res.redirect("/posts");
            }
        else res.render("posts/edit",{post:postForEdit});
    })
});

// 3. UPDATE - /posts/:id - PUT - Update post and redirect somewhere - Post.findByIdAndUpdate()
router.put("/",middleware.isLogged,middleware.isPostOwner,function(req,res){
    // req.body.content = req.sanitize
    // (req.body.content);
    req.body.edited = new Date();    
    Post.findByIdAndUpdate(req.params.id,req.body,function(err){
        if(err){
            req.flash("error","Error in updating post. Please try again!");
            res.redirect("/posts/"+req.params.id+"/edit");
        }
        else{
            req.flash("success","Successfully updated post!");
            res.redirect("/posts/"+req.params.id);}
    })
});

// 4. DESTROY - /posts/:id - DELETE - Delete selected post and redirect - Post.findByIdAndRemove()
router.delete("/",middleware.isLogged,middleware.isPostOwner,function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err){
        if(err){ 
            req.flash("error","Cannot find post. It may have already been deleted!");
            res.redirect("/posts/"+req.params.id)
        }
        else{
            req.flash("success","Post successfully deleted!")
            res.redirect("/posts");}
    })
});

module.exports  = router;