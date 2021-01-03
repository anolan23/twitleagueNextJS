import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const num = req.query.num;
        const offset = req.query.offset;
        const userId = req.query.userId;
        if(num && offset){
            if(userId){
                const posts = await Posts.findByUserId(userId, num, offset);
                res.send(posts);
            }
            else{
                const posts = await Posts.find(num, offset);
                res.send(posts);
            }
        }

        
    }
    else if(method === "POST"){
        const replyData = req.body.reply;
        const recent = req.body.recent;
        if(replyData){
            const regex = /\$(\w+)/g;
            const teamAbbrevs = replyData.body.match(regex);
            const reply = await Posts.reply(replyData, teamAbbrevs);
            res.send(reply);
        }
        else{
            const regex = /\$(\w+)/g;
            const teamAbbrevs = req.body.body.match(regex);
            const postData = req.body;
            const post = await Posts.create(postData, teamAbbrevs);
            res.send(post);
        }
        
    }
    else{
        res.status(405).json({message: "api/posts only supports GET/POST method"})
    }
    
}