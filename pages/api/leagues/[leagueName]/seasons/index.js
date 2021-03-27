import Seasons from "../../../../../db/repos/Seasons";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
      
    }
    else if(method === "GET"){
     const query = req.query;
     const seasons = await Seasons.findByLeagueName(query.leagueName);
     res.send(seasons);
      
    }
    else{
        res.status(405).json({message: "api/leagues/[leagueName]/seasons only supports GET"});
    }
}