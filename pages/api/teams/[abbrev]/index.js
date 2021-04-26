import Teams from "../../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        
    }
    
    else if(method === "GET"){
        const {abbrev, userId} = req.query;
        const team = await Teams.findOne(`$${abbrev}`, userId);
        res.send(team);
    }

    else if(method === "PATCH"){
    
    }
    
    else{
        res.status(405).json({message: "api/teams/[abbrev] only supports POST, GET, PATCH methods"})
    }
}