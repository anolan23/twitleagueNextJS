import Followers from "../../../db/repos/Followers";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){ 
        const userId = req.body.userId;
        const teamId = req.body.teamId;
        const followingRow = await Followers.follow(teamId, userId);
        res.send(followingRow)
    }
    else{
        res.status(405).json({message: "api/follow/team only supports PATCH method"})
    }
    
}
