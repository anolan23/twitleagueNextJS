import {User, Team} from "../../../../db/connect";

export default (async (req,res) => {
    const teamAbbrev = "$" + req.query.teamAbbrev
    res.json(teamAbbrev)
    
})