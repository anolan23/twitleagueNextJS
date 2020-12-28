import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const conversation_id = req.query.conversation_id;
        const posts = await Posts.findByConversationId(conversation_id);
        res.send(posts);
    }
    else{
        res.status(405).json({message: "api/posts/team only supports GET method"})
    }
    
}