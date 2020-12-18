import Posts from "../../../db/repos/Posts";

export default async (req,res) => {
    const method = req.method;
    if(method === "POST"){
        const regex = /\$(\w+)/g;
        const teamAbbrevs = req.body.body.match(regex);
        console.log("teamAbbrevs",teamAbbrevs)
        const postData = req.body;
        console.log("postData", postData)
        const post = await Posts.create(postData, teamAbbrevs);
        console.log("post", post);
        res.send(post);
    }
    else{
        res.status(405).json({message: "api/posts only supports POST method"})
    }
    
}