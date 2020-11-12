import {League, User, Team} from "../../../db/connect";

export const getLeague = async (leagueName) => {
    const league = await League.findOne({leagueName:leagueName});
    const userId = league.owner;
    const user =  await User.findById(userId);
    const teams = await Team.find({ _id: { $in: league.teams}});
    return {...league._doc, owner: user.username, teams: teams};
}

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
      
    }
    else if(method === "GET"){
      const leagueName = req.query.leagueName;
      const league = await getLeague(leagueName);
      res.json(league);
    }
    else{
        res.status(405).json({message: "api/league/[leagueName] only supports GET"});
    }
}