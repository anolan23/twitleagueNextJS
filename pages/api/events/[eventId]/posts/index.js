import Posts from "../../../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  const { eventId, userId, startIndex, stopIndex } = req.query;

  if (method === "POST") {
  } else if (method === "GET") {
    const offset = startIndex || null;
    const limit = stopIndex - startIndex || null;
    const posts = await Posts.findByEventConversationId({
      eventId,
      userId,
      offset,
      limit,
    });
    res.send(posts);
  } else if (method === "PATCH") {
  } else {
    res.status(405).json({
      message:
        "api/events/:eventId/posts only supports POST, GET, PATCH methods",
    });
  }
};
