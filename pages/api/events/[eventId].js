import Events from "../../../db/repos/Events";

export default async (req,res) => {
    const method = req.method;
    
    if(method === "POST"){

    }
    
    else if(method === "GET"){
        const query = req.query;
        const event = await Events.findOneEventById(query.eventId);
        res.send(event);   
    }

    else if(method === "PATCH"){
      const query = req.query;
      const body = req.body;
      const event = await Events.updateEvent(query.eventId, body.values);
      res.send(event);
    }
    
    else{
        res.status(405).json({message: "api/events/:eventId only supports POST, GET, PATCH methods"})
    }
}