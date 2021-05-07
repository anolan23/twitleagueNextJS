import Posts from "../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  const { userId, teamId, startIndex, stopIndex } = req.query;

  if (method === "GET") {
    const offset = startIndex;
    const limit = stopIndex - startIndex;
    const posts = await Posts.findByTeamId(userId, teamId, offset, limit);
    res.send(posts);
  } else {
    res
      .status(405)
      .json({ message: "api/posts/team only supports GET method" });
  }
};
