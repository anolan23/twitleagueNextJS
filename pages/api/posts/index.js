import Posts from "../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  if (method === "GET") {
    const { query, num, offset, userId } = req.query;
    if (query) {
      const posts = await Posts.search(query, userId, num, offset);
      res.send(posts);
    } else {
      const posts = await Posts.findFollowedTeamsPosts(userId, num, offset);
      res.send(posts);
    }
  } else if (method === "POST") {
    const teamRegex = /\$(\w+)/g;
    const userRegex = /\@(\w+)/g;
    const teamMentions = req.body.body.match(teamRegex);
    const userMentions = req.body.body.match(userRegex);
    const postData = req.body;
    const post = await Posts.create(postData, teamMentions, userMentions);
    res.send(post);
  } else {
    res
      .status(405)
      .json({ message: "api/posts only supports GET/POST method" });
  }
};
