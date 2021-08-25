import Teams from "../../../db/repos/Teams";

export default async (req, res) => {
  const { method } = req;

  if (method === "GET") {
    const { userId, startIndex, stopIndex } = req.query;
    const offset = startIndex || null;
    const limit = stopIndex - startIndex || null;

    const teams = await Teams.findSuggested(userId, offset, limit);
    res.send(teams);
  } else {
    res
      .status(405)
      .json({ message: "api/teams/suggested only supports GET methods" });
  }
};
