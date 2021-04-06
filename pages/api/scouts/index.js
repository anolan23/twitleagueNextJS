import Scouts from "../../../db/repos/Scouts";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){ 
        const {scouted_user_id, scout_user_id} = req.body;
        const scout = await Scouts.scout(scouted_user_id, scout_user_id);
        res.send(scout)
    }

    else if(method === "DELETE"){
        const {scouted_user_id, scout_user_id} = req.query;
        const scout = await Scouts.unScout(scouted_user_id, scout_user_id);
        res.send(scout);
    }

    else{
        res.status(405).json({message: "api/scouts only supports POST, DELETE methods"})
    }
    
}