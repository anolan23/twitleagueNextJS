import {User, Team, League} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
        //create Team
        const team = new Team({
            teamName: req.body.teamName,
            teamAbbrev: req.body.teamAbbrev,
            league: req.body.league,
            sport: req.body.sport,
            owner: req.body.owner
          });
        
          team.save((err,savedTeam) => {
            if(err){
              console.log(err);
            }
            else{
              res.send(team);
               //Find the league that already passed validation
              League.findOne({leagueName: savedTeam.league}, function(err, league) {
                if(err){
                  console.log(err)
                }
                else{
                  User.findById(league.owner, function(err,user){
                    if(err){
                      console.log(err);
                    }
                    else{
                      const notification = {
                        type: "Join League Request",
                        data: {
                          teamIssuingRequest: savedTeam,
                          leagueToJoin: league
                        }
                        
        
                      }
                      user.notifications = [...user.notifications, notification]
                      user.save(function(err, doc) {
                        if(err)
                        {
                          console.log(err);
                          res.json(err);
                        }
                        else{
                          res.json({message: "successfully created team and sent a join league request notification to the league owner"})
                        }
                      });
                    }
                  });
                }
              });
            }
          });
    }
    else if(method === "GET"){
      const teams = await Team.find({});
      res.json(teams);
    }
    else{
        res.status(405).json({message: "api/team only supports POST, GET methods"})
    }
}