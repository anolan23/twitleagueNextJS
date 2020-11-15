import {Team} from "../../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    const teamAbbrev = "$" + req.query.teamAbbrev
    if(method === "PATCH"){
       const teamImageUrl = req.body.teamImageUrl;
       const bannerImageUrl = req.body.bannerImageUrl;
       const team = await Team.findOne({teamAbbrev: teamAbbrev});
       team.image = teamImageUrl;
       team.banner = bannerImageUrl;
       team.save(err => {
           if(err){
               ref.status(405).json(err);
           }
           else{
               res.json(team);
           }
       })
    }
    else if(method === "GET"){
        const team = await Team.findOne({teamAbbrev: teamAbbrev});
        res.json(team)
    }
    else{
        res.status(405).json({message: "api/team/[teamAbbrev] only supports PATCH, GET methods"})
    } 
}