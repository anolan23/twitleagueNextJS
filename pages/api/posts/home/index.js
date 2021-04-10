import Posts from "../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    const {num, offset, userId} = req.query;
    if(method === "GET"){
        const posts = await Posts.homeTimeline(userId, num, offset);
        res.send(posts);
    }
    else if(method === "POST"){
       
    }
    else{
        res.status(405).json({message: "api/posts/home only supports GET method"})
    }
    
}