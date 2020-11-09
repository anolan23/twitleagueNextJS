import {Post, Team} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const num = Number(req.query.num);
        Post
        .find({})
        .sort({ likes: -1 })
        .limit(num)
        .exec(function(err, posts) {
            if(err)
            {
            console.log(err);
            res.json({err});
            }
            var mapped = posts.map(post => ({ [post._id]: post }) );
            var newObj = Object.assign({}, ...mapped );
            
            res.json(newObj);
        });
    }
    else{
        res.status(405).json({message: "api/posts/trending only supports GET method"})
    }
    
}