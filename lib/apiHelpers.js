import {User, Team, League} from "../db/connect";


export const getUser = async (username) => {
    // const user = await User.findOne({username});
    // const teams = await Team.find({owner:user._id});
    // const leagues = await League.find({owner: user._id});
    // const foundWatchListTeams = await Team.find({ _id: { $in: user.watchList}});
    // const data = {
    //   ...user._doc,
    //   isSignedIn: true,
    //   teams,
    //   leagues,
    //   watchListTeams:foundWatchListTeams
    // }
    // const {salt, hash, ...dataToSend} = data
    // console.log("dataToSend",dataToSend)
    // return dataToSend;


  }