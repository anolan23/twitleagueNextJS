import Posts from "../../../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const { username, userId, startIndex, stopIndex } = req.query;
    const offset = startIndex;
    const limit = stopIndex - startIndex;
    const posts = await Posts.findByUsername(username, userId, offset, limit);
    res.send(posts);
  } else {
    res.status(405).json({
      message: "/api/users/[username]/posts only supports GET method",
    });
  }
};
