import Leagues from "../../../../db/repos/Leagues";

export default async (req, res) => {
  const method = req.method;
  if (method === "GET") {
    const { leagueId } = req.query;
    const divisions = await Leagues.findDivisions(leagueId);
    res.send(divisions);
  } else if (method === "POST") {
    const { leagueId, seasonId } = req.body;
    const division = await Leagues.createDivision(leagueId, seasonId);
    res.send(division);
  } else if (method === "PATCH") {
    const { divisionId, newDivisionName } = req.body;
    const division = await Leagues.updateDivisionName(
      divisionId,
      newDivisionName
    );
    res.send(division);
  } else if (method === "DELETE") {
    const { divisionId } = req.query;
    const division = await Leagues.deleteDivision(divisionId);
    res.send(division);
  } else {
    res.status(405).json({
      message: "api/leagues/divisions only supports GET, POST, PATCH, DELETE",
    });
  }
};
