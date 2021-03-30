import Posts from "../../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const {threadId, userId} = req.query;
        const replies = await Posts.findThreadReplies(threadId, userId);
        res.send(replies);
    }
    else if(method === "POST"){
        const {reply} = req.body;
        const teamRegex = /\$(\w+)/g;
        const userRegex = /\@(\w+)/g;
        const teamMentions = reply.body.match(teamRegex);
        const userMentions = reply.body.match(userRegex);
        const post = await Posts.reply(reply, teamMentions, userMentions);
        res.send(post);
    }
    else{
        res.status(405).json({message: "api/thread/:threadId/replies only supports GET method"})
    }
    
}