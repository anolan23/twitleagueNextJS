import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const userId = req.query.userId;
        const teamId = req.query.teamId;
        const posts = await Posts.findByTeamId(userId, teamId);
        res.send(posts);
    }
    else{
        res.status(405).json({message: "api/posts/team only supports GET method"})
    }
    
}
