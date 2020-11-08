import {User, Team} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){ 
        const userId = req.body.userId;
        const teamId = req.body.teamId;
        User.findById(userId, function(err, user){
            let watchList = [...user.watchList, teamId]
            user.watchList = watchList;
            user.save((err,savedUser) => {
                if(err){
                    console.log(err);
                }
                else{
                    Team.findById(teamId, function(err, team) {
                        let watchers = [...team.watchers, userId]
                        team.watchers = watchers;
                        team.save((err,savedTeam) => {
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.json({watchList: savedUser.watchList, watchers: savedTeam.watchers})
                            }
                        });
                    
                    })
                }
            })
        })
    }
    else{
        res.status(405).json({message: "api/watch/team only supports PATCH method"})
    }
    
}
