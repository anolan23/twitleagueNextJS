export default async (req,res) => {
    const method = req.method;
    if(method === "PATCH"){
        const teamId = req.body.teamId;
        const userId = req.body.userId;
    }
    else if(method === "GET"){

    }
    else{
        res.status(405).json({message: "api/join/team only supports PATCH request"})
    }
}