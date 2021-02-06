import Teams from "../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        const {event} = req.body;
        console.log("post event", event);
        const createdEvent = await Teams.createEvent(event);
        res.send(createdEvent);

    }
    
    else if(method === "GET"){
      const teamId = req.query.teamId;
      const events = await Teams.findEventsByTeamId(teamId)
      res.send(events);
        
    }

    else if(method === "PATCH"){
      
    }
    
    else{
        res.status(405).json({message: "api/teams/events only supports POST, GET, PATCH methods"})
    }
}