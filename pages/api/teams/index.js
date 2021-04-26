import Teams from "../../../db/repos/Teams";
import Database from "../../../db/repos/Database";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        //create Team
        const {teamName, teamAbbrev, league, city, state, owner} = req.body;
        const teamData = {
            teamName,
            teamAbbrev,
            league,
            city,
            state,
            owner
          }
        
        await Teams.create(teamData);
        res.status(200);

    }
    
    else if(method === "GET"){
      const {leagueId, search, abbrev, userId} = req.query;
      if(leagueId){
        const teams = await Teams.findByLeagueId(leagueId);
        res.send(teams)
      }
      else if(search){
        const teams = await Teams.search(search);
        res.send(teams);
      }
      else if(abbrev){
        console.log(abbrev)
        const team = await Teams.findOne(abbrev, userId);
        res.send(team);
      }
      else{
        const teams = await Teams.find();
        res.send(teams);
      }
        
    }

    else if(method === "PATCH"){
      const {teamId, columns} = req.body;
      const team = await Database.updateById(teamId, "teams", columns);
      res.send(team);
    }
    
    else{
        res.status(405).json({message: "api/teams only supports POST, GET, PATCH methods"})
    }
}