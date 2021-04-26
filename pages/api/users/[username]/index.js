import Users from "../../../../db/repos/Users";

export default async (req,res) => {
    const method = req.method;

    if(method === "GET"){
        const {username, userId} = req.query;
        const user = await Users.findOne(username, userId);
        res.send(user);
    }

    else{
        res.status(405).json({message: "/users/[username] only supports GET method"})
    }
    
}