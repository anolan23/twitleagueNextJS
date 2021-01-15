import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const targetUserId = req.query.targetUserId;
        const userId = req.query.userId;
        console.log("targetUserId",targetUserId)
        console.log("userId",userId)
        const num = req.query.num;
        const offset = req.query.offset;
        const posts = await Posts.findByUserId(targetUserId, userId, num, offset);
        res.send(posts);
    }

    else{
        res.status(405).json({message: "api/posts/user only supports GET method"})
    }
    
}