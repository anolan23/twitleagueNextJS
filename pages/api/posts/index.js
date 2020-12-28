import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
        const replyData = req.body.reply;
        console.log("replyData", replyData)
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
        res.status(405).json({message: "api/posts only supports POST method"})
    }
    
}