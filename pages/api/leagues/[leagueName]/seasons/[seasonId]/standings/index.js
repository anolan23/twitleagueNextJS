import Leagues from "../../../../../../../db/repos/Leagues";

export default async (req,res) => {
    const method = req.method;
    const {leagueName, seasonId} = req.query;
    if(method === "POST"){
      
    }
    else if(method === "GET"){
     const standings = await Leagues.standings(leagueName, seasonId);
     res.send(standings);
      
    }
    else{
        res.status(405).json({message: "api/leagues/[leagueName]/seasons/[seasonId]/standings only supports GET"});
    }
}