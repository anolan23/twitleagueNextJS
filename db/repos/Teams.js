import pool  from "../pool";

class Teams {

    static async findOne(abbrev) {
        const {rows} = await pool.query(`
        SELECT teams.id, team_name, abbrev, teams.avatar, banner, teams.created_at, username AS head_coach, league_id, league_name
        FROM teams
        JOIN users ON teams.owner_id = users.id
        JOIN leagues ON teams.league_id = leagues.id
        WHERE abbrev = $1`, [abbrev]);
        return rows[0];
    }
}

export default Teams;