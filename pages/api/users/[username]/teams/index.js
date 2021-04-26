import Teams from "../../../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const {username} = req.query;
        const teams = await Teams.findByUsername(username);
        res.send(teams);  
    }
    
    else{
        res.status(405).json({message: "api/users/[username]/teams only supports GET methods"})
    }
}