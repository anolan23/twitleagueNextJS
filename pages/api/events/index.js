import Teams from "../../../db/repos/Teams";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        const {event} = req.body;
        const createdEvent = await Teams.createEvent(event);
        res.send(createdEvent);
    }
    
    else if(method === "GET"){
        
    }

    else if(method === "PATCH"){
      
    }
    
    else{
        res.status(405).json({message: "api/events only supports POST, GET, PATCH methods"})
    }
}