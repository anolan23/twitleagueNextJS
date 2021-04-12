import Leagues from "../../../db/repos/Leagues";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
      const leagueId = req.query.leagueId;
      const divisions = await Leagues.findDivisions(leagueId);
      res.send(divisions);
    }
    else if(method === "POST"){
        const leagueId = req.body.leagueId;
        const division = await Leagues.createDivision(leagueId);
        res.send(division);
    }

    else if(method === "PATCH"){
        const divisionId = req.body.divisionId;
        const newDivisionName = req.body.newDivisionName;
        const division = await Leagues.updateDivisionName(divisionId, newDivisionName);
        res.send(division);
    }
    
    else{
        res.status(405).json({message: "api/leagues/divisions only supports GET/POST"})
    }
}