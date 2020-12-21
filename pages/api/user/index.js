import {verify} from "jsonwebtoken";
import Users from "../../../db/repos/Users";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET")
            verify(req.cookies.auth, process.env.AUTH_TOKEN_SECRET, async function(err, decoded) {
                if (!err && decoded) {
                    const username = decoded.username;
                    let user = await Users.findOne(username);
                    user = {...user, isSignedIn: true}
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