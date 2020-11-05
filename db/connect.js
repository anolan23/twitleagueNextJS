import mongoose from "mongoose";
import {userSchema, teamSchema, leagueSchema, postSchema} from "./schema";

const connection = mongoose.createConnection(
    "mongodb://localhost:27017/twitleagueDB",
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