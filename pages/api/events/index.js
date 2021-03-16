import Events from "../../../db/repos/Events";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){
        const {event} = req.body;
        const createdEvent = await Events.createEvent(event);
        res.send(createdEvent);
    }
    
    else if(method === "GET"){
        const events = await Events.find();
        res.send(events);
    }

    else if(method === "PATCH"){
      
    }
    
    else{
        res.status(405).json({message: "api/events only supports POST, GET, PATCH methods"})
    }
}