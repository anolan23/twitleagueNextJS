import Rosters from "../../../../../db/repos/Rosters";

export default async (req, res) => {
  const method = req.method;
  const { abbrev } = req.query;
  if (method === "GET") {
    const roster = await Rosters.findByAbbrev(abbrev);
    res.send(roster);
  } else if (method === "POST") {
  } else {
    res.status(405).json({
      message: "api/teams/[abbrev]/rosters only supports GET/POST methods",
    });
  }
};
