import Teams from "../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const num = req.query.num;
        const userId = req.query.userId;
        const teams = await Teams.findSuggested(userId, num);
        res.send(teams);
    }
    
    else{
        res.status(405).json({message: "api/teams/suggested only supports GET methods"})
    }
}