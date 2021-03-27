import Posts from "../../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const userId = req.query.userId;
        const {threadId} = req.query;
        const replies = await Posts.findThreadReplies(threadId);
        res.send(replies);
    }
    else{
        res.status(405).json({message: "api/thread/:threadId only supports GET method"})
    }
    
}