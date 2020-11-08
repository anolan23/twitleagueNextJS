import {Post, Team} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const watchList = req.query["watchList[]"];
        Team.find({ _id: { $in: watchList}}, function(err, foundTeams){
          if(err){
            console.log(err);
          }
          else{
            const teamAbbrevs = foundTeams.map(foundTeam => foundTeam.teamAbbrev);
            console.log("teamAbbrevs", teamAbbrevs);
            Post.find({ teamAbbrevs: { $in: teamAbbrevs}}).sort({ _id: -1 }).limit(10).exec(function(err, posts) {
              if(err)
              {
                console.log(err);
              }
              var mapped = posts.map(post => ({ [post._id]: post }) );
              var newObj = Object.assign({}, ...mapped );
              
              res.json(newObj);
            });
          }
        
      });
    }
    else{
        res.status(405).json({message: "api/posts/watchlist only supports GET method"})
    }
    
}
