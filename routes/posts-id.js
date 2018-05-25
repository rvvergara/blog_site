const   express     =   require("express"),
        Post        =   require("../models/post"),
        router      =   express.Router({mergeParams:true});

// 1. SHOW - /posts/:id - GET - show details of clicked post - Post.findByID()
router.get("/",function(req,res){

    Post.findById(req.params.id).populate("comments").exec      (function(err,clickedPost){
        if(err) res.redirect("/posts")
        else res.render("posts/show",{post:clickedPost});
    });
});

// 2. EDIT - /posts/:id/edit - GET - show edit form for clicked post - Post.findByIdAndUpdate()

router.get("/edit",isLogged,function(req,res){
    Post.findById(req.params.id,function(err,postForEdit){
        if(err) res.redirect("/posts")
        else res.render("posts/edit",{post:postForEdit});
    })
});

// 3. UPDATE - /posts/:id - PUT - Update post and redirect somewhere - Post.findByIdAndUpdate()
router.put("/",isLogged,function(req,res){
    // req.body.content = req.sanitize
    // (req.body.content);
    req.body.edited = new Date();    
    Post.findByIdAndUpdate(req.params.id,req.body,function(err){
        if(err) res.redirect("/posts/"+req.params.id+"/edit")
        else res.redirect("/posts/"+req.params.id);
    })
});

// 4. DESTROY - /posts/:id - DELETE - Delete selected post and redirect - Post.findByIdAndRemove()
router.delete("/",isLogged,function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err){
        if(err) res.redirect("/posts/"+req.params.id)
        else res.redirect("/posts");
    })
});

// Middleware to show route only to logged users
function    isLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports  = router;