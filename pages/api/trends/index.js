import Teams from "../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){

    }
    
    else if(method === "GET"){
        const teams = await Teams.findTrending();
        res.send(teams);
        
    }
    
    else{
        res.status(405).json({message: "api/trends only supports POST, GET methods"})
    }
}