import {User, Team, League} from "../../db/connect";
import {compare} from "bcrypt";
import {sign} from "jsonwebtoken";
import cookie from "cookie";

export default async (req,res) => {
    const method = req.method;
    const {username, password} = req.body;
    if(req.method === "POST"){
        User
            .findOne({username: username})
            .exec((err, user) => {
                compare(password, user.password, function(err, result) {
                    if(!err && result){
                        const claims = {
                            sub: user.id,
                            username: user.username
                        }
                        const jwt = sign(claims, process.env.AUTH_TOKEN_SECRET, {expiresIn: "1h"});
                        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            sameSite: 'strict',
                            maxAge: 3600,
                            path: '/'
                          }))
                        
                        Team.find({ owner: user._id}, function (err, teams) {
                            if(err){
                                console.log(err);
                            }
                            else{
                                League.find({owner: user._id}, function(err, leagues) {
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
                                    })
                                }
                                });
                            }
                        });
                    }
                    else{
                        res.json({message: "something wrong with password"});
                    }
                });
            });
    }
    else{
        res.status(405).json({message: "api/login only supports POST method"})
    }

    
}