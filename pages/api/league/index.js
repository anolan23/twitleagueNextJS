import {League} from "../../../db/connect";

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

    }
    else{
        res.status(405).json({message: "api/league only supports POST"})
    }
}