import Rosters from "../../../db/repos/Rosters";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const teamId = req.query.teamId;
        const roster = await Rosters.find(teamId);
        res.send(roster);
    }
    else if(method === "POST"){
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        const roster = Rosters.create(teamId, userId);
        res.send(roster);
    }
    
    else{
        res.status(405).json({message: "api/teams/rosters only supports POST methods"})
    }
}