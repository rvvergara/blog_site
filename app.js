const   express                 =   require("express"),
        mongoose                =   require("mongoose"),
        flash                   =   require("connect-flash"),
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
        app                     =   express(),
        // process.env is the environment object on which app runs
        // then declare below variable
        // 
        url                     =   process.env.DATABASEURL || "mongodb://localhost/blog_site",
        // Routes:
        postRoutes              =   require("./routes/posts"),
        postIdRoutes            =   require("./routes/posts-id"),
        commentRoutes           =   require("./routes/comments"),
        indexRoutes             =   require("./routes/index");
        
//Connect to database or create it
mongoose.connect(url);

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
app.use(methodOverride("_method")); //to use PUT & DELETE methods (html only allows GET and PUSH)
app.use(flash()); 
app.use(expressSanitizer()); //to remove <script> tags from user inputs
app.use(express.static(__dirname + "/public")); //to tell app to use public directory for static files (css and js)

// Using passport 
app.use(passport.initialize());
app.use(passport.session());

// Configuring passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to refer to refer user and flash messages to templates:
app.use(function(req,res,next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.logout = req.flash("logout");
    res.locals.success = req.flash("success");
    next();
});

// Use routes:
app.use("/",indexRoutes);
app.use("/posts",postRoutes);
app.use("/posts/:id",postIdRoutes);
app.use("/posts/:id/comments",commentRoutes);

// seedDB(); 
//To remove old data and initialize new - for testing

//Turning on Node server
app.listen(process.env.PORT||7500,function(){
    console.log("Blog server running at port 7500");
});

