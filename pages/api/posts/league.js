import Posts from "../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  if (method === "GET") {
    const leagueId = req.query.leagueId;
    const posts = await Posts.findByLeagueId(leagueId);
    res.send(posts);
  } else {
    res
      .status(405)
      .json({ message: "api/posts/league only supports GET method" });
  }
};
