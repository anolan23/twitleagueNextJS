import {Team, League} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){
        const league = await League.findById(req.body.league);
        league.teams = [...league.teams, req.body.team._id]
        league.save();
        const team = await Team.findById(req.body.team._id);
        team.verifiedTeam = true;
        await team.save(err => {
          if(err){
            res.json({message: "error saving team"})
          }
        })
        res.json({message: "Team verified by league owner"})
    }
    else if(method === "GET"){

    }
    else{
        res.status(405).json({message: "api/join/league only supports PATCH request"})
    }
}