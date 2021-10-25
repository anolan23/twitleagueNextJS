import Events from "../../../../../db/repos/Events";

export default async (req, res) => {
  const method = req.method;
  const { abbrev, seasonId, userId } = req.query;
  if (method === "GET") {
    let events = await Events.findTeamEvents({
      abbrev: `$${abbrev}`,
      seasonId,
      userId,
    });
    res.send(events);
  } else if (method === "POST") {
  } else {
    res
      .status(405)
      .json({ message: "api/teams/:teamId/events only supports GET methods" });
  }
};
