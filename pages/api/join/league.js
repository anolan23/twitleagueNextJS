import Teams from "../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){
        const {leagueId, teamId} = req.body;
        const team = await Teams.joinLeague(leagueId, teamId);
        if(team){
          res.send("team added to league")
        }
        else{
          res.send("error adding team to league")
        }
    }
    else if(method === "GET"){

    }
    else{
        res.status(405).json({message: "api/join/league only supports PATCH request"})
    }
}