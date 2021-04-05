import Posts from "../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const {threadId, userId} = req.query;
        const thread = await Posts.findThreadHistory(threadId, userId);
        res.send(thread);
    }
    else{
        res.status(405).json({message: "api/thread/:threadId only supports GET method"})
    }
    
}