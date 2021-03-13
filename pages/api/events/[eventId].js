import Teams from "../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){

    }
    
    else if(method === "GET"){
        const query = req.query;
        const event = await Teams.findOneEventById(query.eventId);
        res.send(event);   
    }

    else if(method === "PATCH"){
      
    }
    
    else{
        res.status(405).json({message: "api/events/:eventId only supports POST, GET, PATCH methods"})
    }
}