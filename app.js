const   express             =   require("express"),
        mongoose            =   require("mongoose"),
        bodyParser          =   require("body-parser"),
        methodOverride      =   require("method-override"),
        expressSanitizer    =   require("express-sanitizer"),
        Post                =   require("./models/post"),
        Comment             =   require("./models/comment"),
        seedDB              =   require("./seeds"),
        app                 =   express();
        
//Connect to database or create it
mongoose.connect("mongodb://localhost/blog_site");

// Setting up app.js to use dependencies and access public dir
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine","ejs");

seedDB(); //To remove old data and initialize new - for testing

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
app.get("/posts/new",function(req,res){
    res.render("posts/new");
});

// 3. CREATE - /posts - POST - Create new post and redirect somewhere - Post.create()

app.post("/posts",function(req,res){
    // req.body.content = req.sanitize(req.body.content);
    Post.create(req.body,function(err,post){
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

// 8. NEW COMMENTS - /posts/:id/comments/new - GET - Show comment form for specific post - Post.findByID(req.params.id,callback(err,foundPost)) 
app.get("/posts/:id/comments/new",function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err) console.log(err)
        else res.render("comments/new",{post:foundPost});    
    });
});

// 9. CREATE COMMENT - /posts/:id - POST - Create comment and redirect to post page - Post.findById(req.params.id,callback(err,foundPost))
app.post("/posts/:id",function(req,res){
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

//Turning on Node server
app.listen(7500,function(){
    console.log("Blog server running at port 7500");
});

