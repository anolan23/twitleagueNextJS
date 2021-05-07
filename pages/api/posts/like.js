import Posts from "../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  if (method === "PATCH") {
    const post_id = req.body.postId;
    const user_id = req.body.userId;
    const like = await Posts.like(post_id, user_id);
    if (like) {
      res.send("post like successful");
    } else {
      res.send("post like unsuccessful");
    }
  } else {
    res
      .status(405)
      .json({ message: "api/posts/like only supports PATCH method" });
  }
};
