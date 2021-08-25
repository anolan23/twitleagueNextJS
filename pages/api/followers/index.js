import Followers from "../../../db/repos/Followers";
import Teams from "../../../db/repos/Teams";

export default async (req, res) => {
  const method = req.method;
  const { teamId, userId, startIndex, stopIndex } = req.query;
  const offset = startIndex ?? null;
  const limit = startIndex && stopIndex ? stopIndex - startIndex : null;

  if (method === "GET") {
    const followers = await Teams.findFollowers(teamId, userId, offset, limit);
    res.send(followers);
  } else if (method === "POST") {
    const { teamId, userId } = req.body;
    const follow = await Followers.follow(teamId, userId);
    res.send(follow);
  } else if (method === "DELETE") {
    const follow = await Followers.unFollow(teamId, userId);
    res.send(follow);
  } else {
    res
      .status(405)
      .json({ message: "api/followers only supports POST, DELETE methods" });
  }
};
