// Seed data for project
const   mongoose            =   require("mongoose"),
        Post                =   require("./models/post"),
        Comment             =   require("./models/comment");

let samplePosts      =  [
                            {
                                title:      "First Post",
                                image:      "https://picsum.photos/450/400?image=1075",
                                summary:    "Tempor proident id ea ad.",
                                content:    "<p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p>"        
                            },
                            {
                                title:      "Second Post",
                                image:      "https://picsum.photos/458/354?image=1076",
                                summary:    "Tempor proident id ea ad.",
                                content:    "<p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p>"        
                            },
                            {
                                title:      "Third Post",
                                image:      "https://picsum.photos/458/354?image=1074",
                                summary:    "Tempor proident id ea ad.",
                                content:    "<p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p><p>Nisi aute qui excepteur voluptate qui    aliqua id irure ullamco incididunt. Non non minim pariatur pariatur incididunt commodo ullamco nisi irure exercitation nisi. Eu consequat do mollit qui quis labore sunt nisi sint quis deserunt. Do consequat laborum ad qui.</p>"        
                            },
                        ],

    sampleComment   =   {
                            author: "Real McCoy",
                            text:   "Cupidatat sint laboris officia officia sit mollit.Ipsum ullamco mollit mollit proident id ut occaecat in.",
                        };

// Main function to be exported - calls and executes data initializer function:
function    seedDB(){
    initializeData(removeExistingPosts,removeExistingComments,createNewPosts(samplePosts,createNewComments,sampleComment));
}

//Data initializer - to ensure deleting old data finishes before new data is created:
function initializeData(postremove,commentRemove,callback){
    postremove();
    commentRemove();
}

// Function to remove existing blog posts
function    removeExistingPosts(){
                Post.remove({},function(err){
                    if(err) console.log(err)
                    else{
                        console.log("Removed existing posts!"); 
                    }
                });
            }

// Function to remove existing blog comments
function    removeExistingComments(){
                Comment.remove(function(err){
                    if(err) console.log(err)
                    else console.log("Removed existing comments!");
                });
            }

// Function to create new posts - takes as argument an array of posts, a comment creating function which will push comments into the new posts, and the comment data which the comment function will use as argument
function    createNewPosts(posts,commentFn,comment){
                
                for(let i=0;i<posts.length;i++){
                    Post.create(posts[i],function(err,newPost){
                        if(err) console.log(err)
                        else{
                            commentFn(comment,newPost);
                        }
                    });
                }
            }

// Function that creates new comments. Takes in as argument the comment object that contains new comment data and the post for which the new comment data will be added
function    createNewComments(sample,forPost){
            Comment.create(sample,function(err,newComment){
                    if(err) console.log(err)
                    else{
                        addCommentToPost(forPost,newComment);
                    }
                });
            }

// Function to push new comment object into a post. Takes as argument the post in question and the comment object that will be pushed to the post's comment array
function addCommentToPost(postForComment,commentToPush){
    postForComment.comments.push(commentToPush);
    postForComment.save();
}

module.exports  = seedDB;