import {verify} from "jsonwebtoken";

import {getUser} from "../../../lib/apiHelpers";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET")
            verify(req.cookies.auth, process.env.AUTH_TOKEN_SECRET, async function(err, decoded) {
                if (!err && decoded) {
                    const username = decoded.username;
                    const user = await getUser(username);
                    res.json(user);
                }
                else {
                    res.send("User is not signed in")
                }
              });  
    else{
        res.status(405).json({message: "/user only supports GET method"})
    }
    
}