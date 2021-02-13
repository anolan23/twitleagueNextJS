import Leagues from "../../../db/repos/Leagues";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
      
    }
    else if(method === "GET"){
      const leagueName = req.query.leagueName;
      const league = await Leagues.findOne(leagueName);
      res.send(league);
      
    }
    else{
        res.status(405).json({message: "api/league/[leagueName] only supports GET"});
    }
}