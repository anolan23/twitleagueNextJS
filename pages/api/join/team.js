import {Team} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        Team.findById(teamId, function(err, team) {
            if(err){
            console.log(err);
            }
            else{
                let roster = team.roster;
                if(roster.includes(userId)){
                    res.json({message: "User is already on the team"});
                }
                else{
                    roster = [...roster, userId]
                    team.roster = roster;
                    team.save((err) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.json({message: "User is now on the team's roster"});
                    }
                    });
                }
            }
        });
    }
    else if(method === "GET"){

    }
    else{
        res.status(405).json({message: "api/join/team only supports PATCH request"})
    }
}