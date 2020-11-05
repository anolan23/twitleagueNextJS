import {User} from "../../db/connect";
import {hash} from "bcrypt";
export default async (req,res) => {
    const method = req.method;
    if(req.method === "POST"){
        const saltRounds = 11;
        hash(req.body.password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            const user = new User({
                username:req.body.username,
                password:hash
              });
            user.save((err, savedUser) => {
                res.send(user)
            })
            
        });
    }
    else{
        res.status(405).json({message: "api/signup only supports POST method"})
    }
}