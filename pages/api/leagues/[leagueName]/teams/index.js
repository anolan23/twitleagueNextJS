import Teams from "../../../../../db/repos/Teams";

export default async (req, res) => {
  const method = req.method;
  const { leagueName, userId, startIndex, stopIndex } = req.query;
  const offset = startIndex || null;
  const limit = stopIndex - startIndex || null;
  if (method === "POST") {
  } else if (method === "GET") {
    const teams = await Teams.findByLeagueName(
      leagueName,
      userId,
      offset,
      limit
    );
    res.send(teams);
  } else {
    res
      .status(405)
      .json({ message: "api/leagues/[leagueName]/teams only supports GET" });
  }
};
