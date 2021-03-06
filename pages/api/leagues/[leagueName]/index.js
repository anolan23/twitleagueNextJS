import Leagues from "../../../../db/repos/Leagues";

export default async (req, res) => {
  const method = req.method;
  const { leagueName } = req.query;

  if (method === "POST") {
  } else if (method === "GET") {
    const league = await Leagues.findOne(leagueName);
    if (league) {
      res.send(league);
    } else {
      res.send([]);
    }
  } else if (method === "PATCH") {
    const { columns } = req.body;
    const league = await Leagues.updateByLeagueName(leagueName, columns);
    res.send(league);
  } else {
    res
      .status(405)
      .json({ message: "api/leagues/[leagueName] only supports GET" });
  }
};
