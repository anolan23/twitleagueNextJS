import Followers from "../../../db/repos/Followers";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){ 
        const userId = req.body.userId;
        const teamId = req.body.teamId;
        const followingRow = await Followers.follow(teamId, userId);
        res.send(followingRow)
    }

    else if(method === "DELETE"){
        const userId = req.query.userId;
        const teamId = req.query.teamId;
        const followedRow = await Followers.unFollow(teamId, userId);
        res.send(followedRow);
    }

    else{
        res.status(405).json({message: "api/followers/team only supports PATCH, DELETE methods"})
    }
    
}