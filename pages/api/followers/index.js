import Followers from "../../../db/repos/Followers";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){ 
        const {teamId, userId} = req.body;
        const follow = await Followers.follow(teamId, userId);
        res.send(follow)
    }

    else if(method === "DELETE"){
        const {userId, teamId} = req.query;
        const follow = await Followers.unFollow(teamId, userId);
        res.send(follow);
    }

    else{
        res.status(405).json({message: "api/followers only supports POST, DELETE methods"})
    }
    
}