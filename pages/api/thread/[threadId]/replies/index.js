import Posts from "../../../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  const { threadId, userId, startIndex, stopIndex } = req.query;
  const offset = startIndex ?? null;
  const limit = startIndex && stopIndex ? stopIndex - startIndex : null;
  if (method === "GET") {
    const replies = await Posts.findThreadReplies(
      threadId,
      userId,
      offset,
      limit
    );
    res.send(replies);
  } else if (method === "POST") {
    const { reply } = req.body;
    const teamRegex = /\$(\w+)/g;
    const userRegex = /\@(\w+)/g;
    const teamMentions = reply.body.match(teamRegex);
    const userMentions = reply.body.match(userRegex);
    const post = await Posts.reply(reply, teamMentions, userMentions);
    res.send(post);
  } else {
    res.status(405).json({
      message: "api/thread/:threadId/replies only supports GET method",
    });
  }
};
