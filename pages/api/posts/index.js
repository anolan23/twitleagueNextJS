import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const num = req.query.num;
        const offset = req.query.offset;
        const userId = req.query.userId;
        const posts = await Posts.findFollowedTeamsPosts(userId, num, offset);
        res.send(posts);
    }
    else if(method === "POST"){
        const replyData = req.body.reply;
        const recent = req.body.recent;
        if(replyData){
            const teamRegex = /\$(\w+)/g;
            const teamAbbrevs = replyData.body.match(teamRegex);
            const reply = await Posts.reply(replyData, teamAbbrevs);
            res.send(reply);
        }
        else{
            const teamRegex = /\$(\w+)/g;
            const userRegex = /\@(\w+)/g;
            const teamMentions = req.body.body.match(teamRegex);
            const userMentions = req.body.body.match(userRegex);
            const postData = req.body;
            const post = await Posts.create(postData, teamMentions, userMentions);
            res.send(post);
        }
        
    }
    else{
        res.status(405).json({message: "api/posts only supports GET/POST method"})
    }
    
}