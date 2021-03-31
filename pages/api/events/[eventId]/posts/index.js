import Posts from "../../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){

    }
    
    else if(method === "GET"){
        const {eventId, userId} = req.query;
        const posts = await Posts.findByEventConversationId(eventId, userId);
        res.send(posts);   
    }

    else if(method === "PATCH"){

    }
    
    else{
        res.status(405).json({message: "api/events/:eventId/posts only supports POST, GET, PATCH methods"})
    }
}