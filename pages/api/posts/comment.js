import {Post} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
        const regex = /\$(\w+)/g;
        const teamAbbrevs = req.body.postText.match(regex);

        const post = new Post({
        author: req.body.author,
        postText: req.body.postText,
        gifId: req.body.gifId,
        outlook: req.body.outlook,
        dateTime: req.body.dateTime,
        teamAbbrevs: teamAbbrevs,
        likes: req.body.likes,
        retwits: req.body.retwits,
        comments: req.body.comments
        });

        post.save((err, post) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("post", req.body.parentPostId);
            Post.findById(req.body.parentPostId, function(err, foundPost) {
            if(err){
                console.log(err);
            }
            else{
                foundPost.comments = {...foundPost.comments, [post._id]: post}
                foundPost.save();
                res.json(foundPost.comments);
            }
            });
        }
        });
    }
    else{
        res.status(405).json({message: "api/posts/comment only supports POST method"})
    }
    
}
