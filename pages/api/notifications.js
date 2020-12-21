import Notifications from "../../db/repos/Notifications";


export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const userId = req.query.userId;
        const notifications = await Notifications.findByUserId(userId);
        res.send(notifications);
    }
    else if(method === "POST"){
       
    }
    else{
        res.status(405).json({message: "api/notifications only supports GET/POST method"})
    }

    
}