import Users from "../../../db/repos/Users";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const {userId, num} = req.query;
        const users = await Users.findSuggested(userId, num);
        res.send(users);
    }
    
    else{
        res.status(405).json({message: "api/users/suggested only supports GET methods"})
    }
}