import {verify} from "jsonwebtoken";
import Users from "../../../db/repos/Users";
import Notifications from "../../../db/repos/Notifications";
import Followers from "../../../db/repos/Followers";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET")
            verify(req.cookies.auth, process.env.AUTH_TOKEN_SECRET, async function(err, decoded) {
                if (!err && decoded) {
                    const username = decoded.username;
                    let user = await Users.findOne(username);
                    const notifications = await Notifications.findByUserId(user.id);
                    const following = await Followers.findAllTeamsFollowed(user.id);
                    user = {...user, notifications, following, isSignedIn: true}
                    res.send(user);
                }
                else {
                    res.send("unable to verify user")
                }
              });  
    else{
        res.status(405).json({message: "/user only supports GET method"})
    }
    
}