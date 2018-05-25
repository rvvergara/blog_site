const   express     =   require("express"),
        passport    =   require("passport"),
        User        =   require("../models/user"),
        router      =   express.Router();


// 1. ROOT ROUTE - "/" - GET - show landing page (or redirect to index)
router.get("/",function(req,res){
    res.redirect("/posts");
});

// ==========================================
//      AUTHENTICATION ROUTES
// ==========================================

// 2. Signup route - /signup - GET - show signup form
router.get("/signup",function(req,res){
    res.render("signup");
});

// 3. Signup logic - /signup - POST - signup user and redirect
router.post("/signup",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,newUser){
        if(err){ 
            console.log(err);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/posts");
        });
    });
});

// 4. Login route - /login - GET - show login form
router.get("/login",function(req,res){
    res.render("login");
});

// 5. Login logic - /login - POST - login user and redirect
router.post("/login",passport.authenticate("local",({
    successRedirect: "/posts",
    failureRedirect: "/login",
})),function(req,res){
});

// 6. Logout route - /logout - GET - Log user out and redirect
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

module.exports  = router;