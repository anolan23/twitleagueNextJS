import Events from "../../../../../db/repos/Events";

export default async (req,res) => {
    const method = req.method;
    const {eventId, userId} = req.query;
    if(method === "GET"){
        const users = await Events.findUsersWhoLiked(eventId);
        res.send(users);
    }

    else if(method === "POST"){
        const {userId} = req.body;
        const like = await Events.like(eventId, userId);
        res.send(like);
    }

    else if(method === "DELETE"){
        const like = await Events.unLike(eventId, userId);
        res.send(like);
    }
    else{
        res.status(405).json({message: "api/events/:eventId/likes only supports POST, DELETE method"})
    }
    
}