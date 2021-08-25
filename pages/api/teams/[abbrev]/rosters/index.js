import Teams from "../../../../../db/repos/Teams";

export default async (req, res) => {
  const { method } = req;
  const { abbrev, userId, startIndex, stopIndex } = req.query;
  const offset = startIndex || null;
  const limit = stopIndex - startIndex || null;
  if (method === "GET") {
    const roster = await Teams.findRoster(abbrev, userId, offset, limit);
    res.send(roster);
  } else if (method === "POST") {
  } else {
    res.status(405).json({
      message: "api/teams/[abbrev]/rosters only supports GET/POST methods",
    });
  }
};
