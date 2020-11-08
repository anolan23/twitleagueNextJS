import {Team} from "../../../../db/connect";

export default async (req,res) => {
    const teamAbbrev = "$" + req.query.teamAbbrev
    const team = await Team.findOne({teamAbbrev: teamAbbrev});
    res.json(team)
    
}