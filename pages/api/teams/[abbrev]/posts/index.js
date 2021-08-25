import Posts from "../../../../../db/repos/Posts";

export default async (req, res) => {
  const method = req.method;
  const { abbrev, filter, userId, startIndex, stopIndex } = req.query;
  console.log(abbrev);
  const offset = startIndex ?? null;
  const limit = startIndex && stopIndex ? stopIndex - startIndex : null;

  if (method === "GET") {
    try {
      switch (filter) {
        case "mentions":
          const mentions = await Posts.findTeamMentions(
            `$${abbrev}`,
            userId,
            offset,
            limit
          );
          res.send(mentions);
          break;
        case "media":
          const media = await Posts.findTeamMedia(
            `$${abbrev}`,
            userId,
            offset,
            limit
          );
          res.send(media);
          break;

        default:
          res.send([]);
          break;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 500, error });
    }
  } else {
    res
      .status(405)
      .json({ message: "api/teams/[abbrev]/posts only supports GET method" });
  }
};
