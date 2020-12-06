import {User} from "../../db/connect";
import {hash} from "bcrypt";
import {sign} from "jsonwebtoken";
import cookie from "cookie";

import {getUser} from "../../lib/apiHelpers";

export default async (req,res) => {
    const method = req.method;
    if(req.method === "POST"){
        const username = req.body.username;
        const password = req.body.password;
        const saltRounds = 11;
        const hashed = await hash(password, saltRounds);
        const user = new User({
            username:username,
            password:hashed
          });
        user.save();
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
          
        const userToSend = await getUser(user.username);
        res.send(userToSend);
    }
    else{
        res.status(405).json({message: "api/signup only supports POST method"})
    }
}