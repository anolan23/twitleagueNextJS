import Users from "../../../db/repos/Users";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const userId = req.query.userId;
        const num = req.query.num;
        const users = await Users.findSuggested(num);
        res.send(users);
    }
    
    else{
        res.status(405).json({message: "api/users/suggested only supports GET methods"})
    }
}