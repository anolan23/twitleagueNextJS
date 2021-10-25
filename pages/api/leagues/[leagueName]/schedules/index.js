import Events from "../../../../../db/repos/Events";

export default async (req, res) => {
  const method = req.method;
  const { leagueName, seasonId } = req.query;
  if (method === "POST") {
  } else if (method === "GET") {
    if (!seasonId) {
      const schedule = await Events.findScheduleByLeagueName(leagueName);
      console.log(schedule);
      res.send(schedule);
    } else {
      const schedule = await Events.findScheduleBySeasonId(seasonId);
      res.send(schedule);
    }
  } else {
    res.status(405).json({
      message: "api/leagues/[leagueName]/schedules only supports GET",
    });
  }
};
