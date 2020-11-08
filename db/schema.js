import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  notifications:
  {
    type:Array,
    default: null
  },
  watchList: [String]
});

export const teamSchema = new mongoose.Schema({
  teamName: String,
  teamAbbrev: String,
  league: String,
  verifiedTeam: {
    type: Boolean,
    default: false
  },
  sport: String,
  owner: String,
  watchers: [String],
  events: {
    type: Array,
    default: []
  },
  roster: {
    type: Array,
    default: []
  },
  image: String
  }
);

export const leagueSchema = new mongoose.Schema({
  sport: String,
  leagueName: String,
  numTeams: String,
  teams: [String],
  owner: String
  }
);

export const postSchema = new mongoose.Schema({
  author: String,
  postText: String,
  gifId: String,
  outlook: String,
  dateTime: String,
  teamAbbrevs: [String],
  likes: {
    type: Object,
    default: null
  },
  retwits: {
    type: Object,
    default: null
  },
  comments: {
    type: Object,
    default: null
  }
  }
);