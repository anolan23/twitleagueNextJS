import {League, Post, Team} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const league = await League.findOne({leagueName: req.query.league});
        const teamIds = league.teams; //array of teamIds in league
        const teams = await Team.find({ _id: { $in: teamIds}})
        const teamAbbrevs = teams.map(team => team.teamAbbrev);
        const posts = await Post.find({ teamAbbrevs: { $in: teamAbbrevs}}).sort({ _id: -1 }).limit(10);
        res.json(posts);

    }
    else{
        res.status(405).json({message: "api/posts/league only supports GET method"})
    }
    
}