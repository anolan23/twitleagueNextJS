import Posts from "../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const userId = req.query.userId;
        const {threadId} = req.query;
        const thread = await Posts.findThreadHistory(threadId);
        res.send(thread);
    }
    else{
        res.status(405).json({message: "api/thread/:threadId only supports GET method"})
    }
    
}