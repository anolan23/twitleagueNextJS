import Users from "../../db/repos/Users";
import {compare} from "bcrypt";
import {sign} from "jsonwebtoken";
import cookie from "cookie";

export default async (req,res) => {
    const method = req.method;
    const {username, password} = req.body;
    if(method === "POST"){
        let user = await Users.findOne(username);
        user = {...user, isSignedIn: true};
        const result = await compare(password, user.password);
        console.log("result", result)
        if(result){
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
                }));
            res.send(user);
        }
        else{
            res.json({message: "something wrong with password"});
        }    
    }
    else{
        res.status(405).json({message: "api/login only supports POST method"})
    }

    
}