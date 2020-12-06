import {Team} from "../../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
        const teamAbbrev = "$"+req.query.teamAbbrev;
        console.log(teamAbbrev);
        const eventValues = req.body.values;
        const foundTeam = await Team.findOne({teamAbbrev:teamAbbrev});
        let events = foundTeam.events;
        events = [...events, eventValues]
        foundTeam.events = events;
        foundTeam.save((err, doc) => {
            if(err){
            console.log(err)
            }
            else{
            res.send(events);
            }
        });
    }
    else if(method === "GET"){
      
    }
    else{
        res.status(405).json({message: "api/events/team/[teamAbbrev] only supports POST"});
    }
}