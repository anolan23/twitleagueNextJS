import Posts from "../../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    const {postId, userId} = req.query;
    if(method === "GET"){
        const users = await Posts.findUsersWhoLiked(postId);
        res.send(users);
    }

    else if(method === "POST"){
        const {userId} = req.body;
        const like = await Posts.like(postId, userId);
        res.send(like);
    }

    else if(method === "DELETE"){
        const like = await Posts.unLike(postId, userId);
        res.send(like);
    }
    else{
        res.status(405).json({message: "api/posts/:postId/likes only supports POST, DELETE method"})
    }
    
}