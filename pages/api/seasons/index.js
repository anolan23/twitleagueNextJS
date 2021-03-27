import Seasons from "../../../db/repos/Seasons";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        const leagueId = req.body.leagueId;
        const season = await Seasons.create(leagueId);
        res.send(season)
    }
    
    else if(method === "GET"){
        const seasons = await Seasons.find();
        res.send(seasons);
    }

    else if(method === "PATCH"){
        const leagueId = req.body.leagueId;
        const season = await Seasons.end(leagueId);
        res.send(season)
    }
    
    else{
        res.status(405).json({message: "api/seasons only supports POST, GET, PATCH methods"})
    }
}


      