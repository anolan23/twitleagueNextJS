import {Post} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){
        Post.findById(req.body.postId, function(err, post) {
            if(err){
              console.log(err);
            }
            else{
                //like is already present. delete it
                // if(post.likes[req.body.username]){
                //     delete post.likes[req.body.username];
                // }
                //like not present. add it
                // else {
                //     post.likes = {...post.likes, [req.body.username]: req.body.userId}
                // }
                post.likes = {...post.likes, [req.body.username]: req.body.userId}
                post.save();
                res.json(post.likes); 
            }
          });
    }
    else{
        res.status(405).json({message: "api/posts/like only supports PATCH method"})
    }
    
}