import authenticated from "../../../lib/authenticated";

export default authenticated(async (req,res) => {
    const teamAbbrev = "$" + req.query.teamAbbrev
    res.json(req.query.teamAbbrev);
})