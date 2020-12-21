import {League} from "../../../db/connect";
import Leagues from "../../../db/repos/Leagues";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
        //create League
        const league = new League({
            sport: req.body.sport,
            leagueName: req.body.leagueName,
            numTeams: req.body.numTeams,
            owner: req.body.owner
          });
          league.save((err) => {
            if(err){
              console.log(err);
            }
            else{
                res.json({message: "successfully created league"})
            }
          });
    }
    else if(method === "GET"){
      const leagueName = req.query.leagueName;
      const leagues = await Leagues.find(leagueName);
      console.log("leagues", leagues)
      if(!leagues){
        res.send([]);
      }
      else{
        console.log("leagues", leagues)
        res.send(leagues);
      }
    }
    
    else{
        res.status(405).json({message: "api/league only supports POST"})
    }
}