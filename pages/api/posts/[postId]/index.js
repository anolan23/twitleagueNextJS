import Posts from "../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    const {postId, userId} = req.query;
    if(method === "GET"){
       const post = await Posts.findOne(postId, userId);
       res.send(post);
    }
    else if(method === "PATCH"){
       
    }
    else{
        res.status(405).json({message: "api/posts/likes only supports PATCH method"})
    }
    
}