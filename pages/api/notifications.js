import Notifications from "../../db/repos/Notifications";


export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const {userId} = req.query;
        const notifications = await Notifications.findByUserId(userId);
        res.send(notifications);
    }
    else if(method === "POST"){
        const {type} = req.body;
        switch(type){
            case "Join Team Invite": {
                const notification = await Notifications.sendJoinTeamInvite(req.body);
                res.send(notification);
            }
            case "Awaiting Event Approval": {
                const notification = await Notifications.sendAwaitingEventApproval(req.body);
                res.send(notification);
            }
            default:
                res.send("notification type unknown")
        }
        
    }

    else if(method === "DELETE"){
       const notificationId = req.query.notificationId;
       const notification = await Notifications.delete(notificationId);
       res.send(notification);
    }
    else{
        res.status(405).json({message: "api/notifications only supports GET/DELETE method"})
    }

    
}