import Teams from "../../../db/repos/Teams";

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
      const ownerId = req.query.ownerId;
      if(ownerId){
        const teams = await Teams.findByOwnerId(ownerId);
        res.send(teams);
      }
      else{
        const teams = await Teams.find();
        res.send(teams);
      }
        
    }

    else if(method === "PATCH"){
      const teamId = req.body.teamId;
      const values = req.body.values;
      const team = await Teams.update(teamId, values);
      res.send(team);
    }
    
    else{
        res.status(405).json({message: "api/teams only supports POST, GET, PATCH methods"})
    }
}