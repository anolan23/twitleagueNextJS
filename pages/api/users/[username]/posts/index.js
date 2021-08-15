import Posts from "../../../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const { username, filter, userId, startIndex, stopIndex } = req.query;
    const offset = startIndex ?? null;
    const limit = startIndex && stopIndex ? stopIndex - startIndex : null;

    try {
      switch (filter) {
        case "posts":
          const posts = await Posts.findByUsername(
            username,
            userId,
            offset,
            limit
          );
          res.send(posts);
          break;
        case "media":
          const media = await Posts.findByUsernameWithMedia(
            username,
            userId,
            offset,
            limit
          );
          res.send(media);
          break;
        case "likes":
          const likes = await Posts.findLikedByUsername(
            username,
            userId,
            offset,
            limit
          );
          res.send(likes);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 500, error });
    }
  } else {
    res.status(405).json({
      message: "/api/users/[username]/posts only supports GET method",
    });
  }
};
