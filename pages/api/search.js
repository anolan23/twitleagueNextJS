import {User, Team} from "../../db/connect";

export default async (req,res) => {
    const searchTerm = req.query.searchTerm; 
    const teamSearchTerm = searchTerm.replace("$", "\\$&");
    const teamRegExp = new RegExp("^"+ teamSearchTerm);
    const userSearchTerm = searchTerm.replace("@", "")
    const userRegexp = new RegExp("^"+ userSearchTerm);
    
    Team
      .find({$or:[{teamAbbrev: teamRegExp},{teamName: teamRegExp}]})
      .limit(5)
      .exec(function (err, teams) {
        if(err){
          console.log(err)
        }
        else{
          User
            .find({username: userRegexp})
            .limit(5)
            .exec(function(err, users) {
              if(err){
                console.log(err);
              }
              else{
                res.send({
                  teams,
                  users
                });
              }
            });     
        }
        
      });
}