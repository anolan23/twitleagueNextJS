import Events from "../../../../../db/repos/Events";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
     

    }
    
    else if(method === "GET"){
        const {abbrev, seasonId} = req.query;
        let events = await Events.findEventsByTeamAbbrev(`$${abbrev}`);
        if (seasonId) {
            events = events.filter(event => event.season_id == seasonId);
        }
        res.send(events);
    }

    else{
        res.status(405).json({message: "api/teams/:teamId/events only supports GET methods"})
    }
}