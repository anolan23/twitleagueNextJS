import Posts from "../../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    const {userId, startIndex, stopIndex} = req.query;
    if(method === "GET"){
        const offset = startIndex;
        const limit = stopIndex - startIndex;
        const posts = await Posts.homeTimeline(userId, offset, limit);
        res.send(posts);
    }
    else if(method === "POST"){
       
    }
    else{
        res.status(405).json({message: "api/posts/home only supports GET method"})
    }
    
}