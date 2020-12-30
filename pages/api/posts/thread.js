import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const postId = req.query.postId;
        const posts = await Posts.findByPostId(postId);
        res.send(posts);
    }
    else{
        res.status(405).json({message: "api/posts/team only supports GET method"})
    }
    
}