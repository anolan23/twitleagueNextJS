import Posts from "../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        const {eventId} = req.query;
        const {reply} = req.body;
        console.log(reply);
        const teamRegex = /\$(\w+)/g;
        const userRegex = /\@(\w+)/g;
        const teamMentions = reply.body.match(teamRegex);
        const userMentions = reply.body.match(userRegex);
        console.log("userMentions", userMentions);
        const post = await Posts.eventReply(reply, teamMentions, userMentions)
        res.send(post)

    }
    
    else if(method === "GET"){
         
    }

    else if(method === "PATCH"){
     
    }
    
    else{
        res.status(405).json({message: "api/events/replies only supports POST, GET, PATCH methods"})
    }
}