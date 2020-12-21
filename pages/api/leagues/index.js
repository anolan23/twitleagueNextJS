import Leagues from "../../../db/repos/Leagues";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
      const ownerId = req.query.ownerId;
      const leagueName = req.query.leagueName;
      let leagues;
      if(ownerId){
        leagues = await Leagues.findByOwnerId(ownerId);
        res.send(leagues);
      }
      else if(leagueName){
        leagues = await Leagues.findAllLike(leagueName);
        if(!leagues){
        res.send([]);
        }
        else{
          res.send(leagues);
        }
      }
      else{
        leagues = await Leagues.find();
        res.send(leagues)
      }
      
    }
    else if(method === "POST"){
        const leagueData = req.body;
        console.log("leagueData", leagueData)
        Leagues.create(leagueData);
        res.send({});
    }
    
    
    else{
        res.status(405).json({message: "api/league only supports POST"})
    }
}