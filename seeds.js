// Seed data for project
const   mongoose            =   require("mongoose"),
        Post                =   require("./models/post"),
        Comment             =   require("./models/comment");

let samplePosts      =  [
                            {
                                title:      "Test Post 1",
                                image:      "https://picsum.photos/450/400?random",
                                summary:    "Tempor proident id ea ad.",
                                content:    "<p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p>"        
                            },
                            {
                                title:      "Test Post 2",
                                image:      "https://picsum.photos/458/354?image=1076",
                                summary:    "Tempor proident id ea ad.",
                                content:    "<p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p>"        
                            },
                            {
                                title:      "Test Post 3",
                                image:      "https://picsum.photos/458/354?image=1074",
                                summary:    "Tempor proident id ea ad.",
                                content:    "<p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p>"        
                            },
                        ],

    sampleComment   =   {
                            author: "Real McCoy",
                            text:   "Cupidatat sint laboris officia officia sit mollit.Ipsum ullamco mollit mollit proident id ut occaecat in.",
                        };

function    seedDB(){
    // removeExisting Posts and comments:
    removeExistingPosts();
    removeExistingComments();
    // create new posts and comments for each pos:
    createNewPosts(samplePosts,createNewComments,sampleComment);
}

function    removeExistingPosts(){
                Post.remove({},function(err){
                    if(err) console.log(err)
                    else{
                        console.log("Removed existing posts!"); 
                    }
                });
            }
        
function    removeExistingComments(){
                Comment.remove({},function(err){
                    if(err) console.log(err)
                    else console.log("Removed existing comments!");
                });
            }

function    createNewPosts(posts,commentFn,comment){
                for(let post of posts){
                    Post.create(post,function(err,newPost){
                        if(err) console.log(err)
                        else {
                            newPost.comments.push(commentFn(comment));
                            newPost.save();
                        }
                    });
                }
            }

function    createNewComments(sample){
                Comment.create(sample,function(err,newComment){
                    if(err) console.log(err)
                    else console.log("New Comment:", newComment.text,"by:",newComment.author);
                });
            }

module.exports  = seedDB;