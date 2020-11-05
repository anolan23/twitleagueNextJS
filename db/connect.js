import mongoose from "mongoose";
import {userSchema, teamSchema, leagueSchema, postSchema} from "./schema";

const dbUrl = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return "mongodb://localhost:27017/twitleagueDB";
  } else {
      return "mongodb+srv://anolan23:Beta095458%21@twitleague.ufvd6.mongodb.net/twitleagueDB?retryWrites=true&w=majority";
  }
}

const connection = mongoose.createConnection(dbUrl(),
    {
        useNewUrlParser: true, 
        useUnifiedTopology:true
    }
  );

export const User = connection.model("User", userSchema);
export const Team = connection.model("Team", teamSchema);
export const League = connection.model("League", leagueSchema);
export const Post = connection.model("Post", postSchema);

export default connection;