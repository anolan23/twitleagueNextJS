import {Post} from "../../../db/connect";

export default async (req,res) => {
    const method = req.method;
    if(method === "GET"){
        const teamAbbrev = req.query.teamAbbrev;
        Post
            .find({teamAbbrevs: teamAbbrev})
            .sort({ _id: -1 })
            .limit(10)
            .exec(function(err, posts) {
                if(err)
                {
                console.log(err);
                }
                var mapped = posts.map(post => ({ [post._id]: post }) );
                var newObj = Object.assign({}, ...mapped );
                
                res.send(newObj);
            });
    }
    else{
        res.status(405).json({message: "api/posts/team only supports GET method"})
    }
    
}
