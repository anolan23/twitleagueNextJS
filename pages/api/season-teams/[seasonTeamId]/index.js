import Database from "../../../../db/repos/Database";

export default async (req, res) => {
  const { method } = req;
  const { seasonTeamId } = req.query;
  if (method === "GET") {
  } else if (method === "PATCH") {
    const { columns } = req.body;
    const seasonTeam = await Database.updateById(
      seasonTeamId,
      "season_teams",
      columns
    );
    res.send(seasonTeam);
  } else {
    res.status(405).json({
      message:
        "api/season-teams/[seasonTeamId] only supports GET, PATCH methods",
    });
  }
};
