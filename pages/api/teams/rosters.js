import Rosters from "../../../db/repos/Rosters";

export default async (req, res) => {
  const method = req.method;
  if (method === "GET") {
    const teamId = req.query.teamId;
    const roster = await Rosters.find(teamId);
    res.send(roster);
  } else if (method === "POST") {
    const { teamId, userId } = req.body;
    try {
      const player = await Rosters.create(teamId, userId);
      res.status(200).send(player);
    } catch (error) {
      res.status(500).send({ status: 500, error });
    }
  } else {
    res
      .status(405)
      .json({ message: "api/teams/rosters only supports POST methods" });
  }
};
