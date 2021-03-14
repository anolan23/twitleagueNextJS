import Events from "../../../../../db/repos/Events";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
     

    }
    
    else if(method === "GET"){
        const query = req.query
        const events = await Events.findEventsByTeamId(query.teamId);
        res.send(events);
    }

    else{
        res.status(405).json({message: "api/teams/:teamId/events only supports GET methods"})
    }
}