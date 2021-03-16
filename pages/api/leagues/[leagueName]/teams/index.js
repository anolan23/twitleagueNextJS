import Teams from "../../../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
      
    }
    else if(method === "GET"){
      const leagueName = req.query.leagueName;
      const teams = await Teams.findByLeagueName(leagueName);
      res.send(teams);
      
    }
    else{
        res.status(405).json({message: "api/leagues/[leagueId]/teams only supports GET"});
    }
}