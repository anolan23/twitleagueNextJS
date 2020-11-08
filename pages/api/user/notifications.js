import {User, Team} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "DELETE"){
        const userId = req.query.userId;
        const indexToDelete = req.query.indexToDelete;
        User.findById(userId, function(err, user){
            let notifications =user.notifications;
            notifications.splice(indexToDelete,1);
            user.notifications = notifications;
            user.save((err,savedUser) => {
                if(err){
                    console.log(err);
                }
                else{
                    res.json(savedUser.notifications);
                }
            });
        });
    }
    else if(method === "PATCH"){
        const notificationType = req.body.notificationType;
        if(notificationType === "Join Team Request"){
            const teamId = req.body.teamId; //sending to owner of this team
            const userId = req.body.userId //the user who wants to join the team
            Team.findById(teamId, (err, team) => {
                if(err){
                    console.log(err);
                    res.json({message: "Failed to find team by Id"});
                }
                else{
                    const owner = team.owner;
                    User.findById(owner, (err,ownerDecoded) => {
                        if(err){
                            console.log(err);
                            res.json({message: "Failed to find user by Id"})
                        }
                        else{
                            User.findById(userId, (err,user) => {
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    const notification = {
                                        type: "Join Team Request",
                                        data: {
                                        userIssuingRequest: user,
                                        teamToJoin: team
                                        }
                                    }
                                    
                                    let notifications = ownerDecoded.notifications;
                                    notifications = [...notifications, notification]
                                    ownerDecoded.notifications = notifications;
                                    ownerDecoded.save(err => {
                                        if(err){
                                            console.log(err);
                                            res.json({message: "failed to save user notification"})
                                        }
                                        else{
                                            res.json({message: "Join team notification has been sent"})
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        }
    }
    else{
        res.status(405).json({message: "api/user/notifications only supports DELETE, PATCH methods"})
    }
}