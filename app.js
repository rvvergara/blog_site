const   express                 =   require("express"),
        mongoose                =   require("mongoose"),
        bodyParser              =   require("body-parser"),
        methodOverride          =   require("method-override"),
        expressSanitizer        =   require("express-sanitizer"),
        passport                =   require("passport"),
        LocalStrategy           =   require("passport-local"),
        passportLocalMongoose   =   require("passport-local-mongoose"),
        session                 =   require("express-session"),
        Post                    =   require("./models/post"),
        Comment                 =   require("./models/comment"),
        User                    =   require("./models/user"),
        seedDB                  =   require("./seeds"),
        app                     =   express();
        
//Connect to database or create it
mongoose.connect("mongodb://localhost/blog_site");

// Setting up app.js to use dependencies and access public dir
app.set("view engine","ejs");

// Using express-session
app.use(session({
    secret: "To live is Christ",
    resave: false,
    saveUninitialized: false,
}));

// Use basic dependencies
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));

// Using passport 
app.use(passport.initialize());
app.use(passport.session());

// Confuring passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Top Middleware to refer to req.user as user in templates:
app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
});

// seedDB(); 
//To remove old data and initialize new - for testing

// ROUTES:

// 0. LANDING PAGE - "/" - GET - show landing page (or redirect to index)
app.get("/",function(req,res){
    res.redirect("/posts");
});

// 1. INDEX - /posts/ - GET - list all posts - Post.find() 
app.get("/posts",function(req,res){
    Post.find({},function(err,posts){
        if(err) console.log(err)
        else    res.render("posts/index",{posts:posts});
    });
});

// 2. NEW - /posts/new - GET - show new post form - NA
app.get("/posts/new",isLogged,function(req,res){
    res.render("posts/new");
});

// 3. CREATE - /posts - POST - Create new post and redirect somewhere - Post.create()

app.post("/posts",function(req,res){
    // req.body.content = req.sanitize(req.body.content);
    Post.create(req.body.post,function(err,post){
        if(err) res.redirect("/posts/new")
        else res.redirect("/posts");
    })
});

// 4. SHOW - /posts/:id - GET - show details of clicked post - Post.findByID()
app.get("/posts/:id",function(req,res){

    Post.findById(req.params.id).populate("comments").exec      (function(err,clickedPost){
        if(err) res.redirect("/posts")
        else res.render("posts/show",{post:clickedPost});
    });
});

// 5. EDIT - /posts/:id/edit - GET - show edit form for clicked post - Post.findByIdAndUpdate()

app.get("/posts/:id/edit",function(req,res){
    Post.findById(req.params.id,function(err,postForEdit){
        if(err) res.redirect("/posts")
        else res.render("posts/edit",{post:postForEdit});
    })
});

// 6. UPDATE - /posts/:id - PUT - Update post and redirect somewhere - Post.findByIdAndUpdate()
app.put("/posts/:id",function(req,res){
    // req.body.content = req.sanitize
    // (req.body.content);
    req.body.edited = new Date();    
    Post.findByIdAndUpdate(req.params.id,req.body,function(err){
        if(err) res.redirect("/posts/"+req.params.id+"/edit")
        else res.redirect("/posts/"+req.params.id);
    })
});

// 7. DESTROY - /posts/:id - DELETE - Delete selected post and redirect - Post.findByIdAndRemove()
app.delete("/posts/:id",function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err){
        if(err) res.redirect("/posts/"+req.params.id)
        else res.redirect("/posts");
    })
});

/*
==========================================
COMMENT ROUTES
==========================================
*/

// 8. NEW COMMENTS - /posts/:id/comments/new - GET - Show comment form for specific post - Post.findByID(req.params.id,callback(err,foundPost)) 
app.get("/posts/:id/comments/new",isLogged,function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err) console.log(err)
        else res.render("comments/new",{post:foundPost});    
    });
});

// 9. CREATE COMMENT - /posts/:id/comments - POST - Create comment and redirect to post page - Post.findById(req.params.id,callback(err,foundPost))
app.post("/posts/:id/comments",function(req,res){
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

/*
==========================================
AUTHENTICATION ROUTES
==========================================
*/

// 10. Signup route - /signup - GET - show signup form
app.get("/signup",function(req,res){
    res.render("signup");
});

// 11. Signup logic - /signup - POST - signup user and redirect
app.post("/signup",function(req,res){
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

// 12. Login route - /login - GET - show login form
app.get("/login",function(req,res){
    res.render("login");
});

// 13. Login logic - /login - POST - login user and redirect
app.post("/login",passport.authenticate("local",({
    successRedirect: "/posts",
    failureRedirect: "/login",
})),function(req,res){
});

// 14. Logout route - /logout - GET - Log user out and redirect
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

/*
=================
    Middlewares:
==================
*/

// Middleware to show route only to logged users
function    isLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//Turning on Node server
app.listen(7500,function(){
    console.log("Blog server running at port 7500");
});

