import {Team} from "../../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    const teamAbbrev = "$" + req.query.teamAbbrev
    if(method === "PATCH"){
       const imageUrl = req.body.imageUrl;
       const team = await Team.findOne({teamAbbrev: teamAbbrev});
       team.image = imageUrl;
       team.save(err => {
           if(err){
               ref.status(405).json(err);
           }
           else{
               res.json(imageUrl)
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