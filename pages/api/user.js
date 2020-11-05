import {verify} from "jsonwebtoken";
import {User, Team, League} from "../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET")
            verify(req.cookies.auth, process.env.AUTH_TOKEN_SECRET, async function(err, decoded) {
                if (!err && decoded) {
                    const username = decoded.username;
                    User
                        .findOne({username:username})
                        .exec((err,user) => {
                            if(err){
                                res.status(500).json({message: "find User Error"})
                            }
                            else{
                                Team.find({ owner: user._id}, function (err, teams) {
                                    if(err){
                                      console.log(err);
                                    }
                                    else{
                                      League.find({ owner: user._id}, function (err, leagues) {
                                        if(err){
                                          console.log(err);
                                        }
                                        else{
                                          Team.find({ _id: { $in: user.watchList}}, function(err, foundWatchListTeams){
                                            if(err){
                                              console.log(err);
                                            }
                                            else{
                                              const data = {
                                                ...user._doc,
                                                isSignedIn: true,
                                                teams,
                                                leagues,
                                                watchListTeams:foundWatchListTeams
                                              }
                                              const {salt, hash, ...dataToSend} = data
                                              res.send(dataToSend);
                                            }
                                          });
                                      
                                        }
                                      
                                      });
                                    }
                                  
                                });
                            }
                            
                        })
                }
                else {
                    res.send("User is not signed in")
                }
              });  
    else{
        res.status(405).json({message: "/user only supports GET method"})
    }
    
}