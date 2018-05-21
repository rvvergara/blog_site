const   express             =   require("express"),
        mongoose            =   require("mongoose"),
        bodyParser          =   require("body-parser"),
        methodOverride      =   require("method-override"),
        expressSanitizer    =   require("express-sanitizer"),
        app                 =   express();
        
//Connect to database or create it
mongoose.connect("mongodb://localhost/blog_site");

// Setting up app.js to use dependencies and access public dir
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine","ejs");

//Schema and Data Modelling for Blog Site

let     postSchema      = new mongoose.Schema(
                             {
                                title:      String,
                                image:      String,
                                summary:    String,
                                content:    String,
                                created:    {type: Date, default:                Date.now},
                                edited:     {type: Date, default:                Date.now},
                            }
                        ),
        Post            =   mongoose.model("Post",postSchema);

// Sample Data:

// Post.create({
//     title: "Test Post",
//     image: "https://picsum.photos/450/400?random",
//     summary: "Ex enim in enim non sunt velit exercitation.",
//     content:"Consequat id commodo culpa aliqua laboris. Cillum tempor cillum officia exercitation ut fugiat amet id mollit. Ut anim Lorem occaecat eu aliqua consectetur anim culpa fugiat laborum. Labore id ex deserunt Lorem id ad consequat nostrud id. Voluptate dolore et consectetur proident ex qui. Ad Lorem voluptate cillum nisi mollit sunt minim laborum veniam esse officia dolor. Aliquip reprehenderit aliquip amet ut aliqua sunt non laborum."
// },function(err,post){
//     if(err) console.log(err)
//     else console.log(post.title);
// });

// ROUTES:

// 0. LANDING PAGE - "/" - GET - show landing page (or redirect to index)
app.get("/",function(req,res){
    res.redirect("/posts");
});

// 1. INDEX - /posts/ - GET - list all posts - Post.find() 
app.get("/posts",function(req,res){
    Post.find({},function(err,posts){
        if(err) console.log(err)
        else    res.render("index",{posts:posts});
    });
});

// 2. NEW - /posts/new - GET - show new post form - NA
app.get("/posts/new",function(req,res){
    res.render("new");
});

// 3. CREATE - /posts - POST - Create new post and redirect somewhere - Post.create()

app.post("/posts",function(req,res){
    // req.body.content = req.sanitize(req.body.content);
    Post.create(req.body,function(err,post){
        if(err) res.redirect("new")
        else res.redirect("/posts");
    })
});

// 4. SHOW - /posts/:id - GET - show details of clicked post - Post.findByID()
app.get("/posts/:id",function(req,res){
    Post.findById(req.params.id,function(err,clickedPost){
        if(err) res.redirect("/posts")
        else res.render("show",{post:clickedPost});
    });
});

// 5. EDIT - /posts/:id/edit - GET - show edit form for clicked post - Post.findByIdAndUpdate()

app.get("/posts/:id/edit",function(req,res){
    Post.findById(req.params.id,function(err,postForEdit){
        if(err) res.redirect("/posts")
        else res.render("edit",{post:postForEdit});
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

// DESTROY - /posts/:id - DELETE - Delete selected post and redirect - Post.findByIdAndRemove()
app.delete("/posts/:id",function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err){
        if(err) res.redirect("posts/"+req.params.id)
        else res.redirect("/posts");
    })
});

//Turning on Node server
app.listen(7500,function(){
    console.log("Blog server running at port 7500");
});

