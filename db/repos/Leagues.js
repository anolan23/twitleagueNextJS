import pool  from "../pool";

class Leagues {

    static async create(team) {
        // const {rows} = await pool.query(`
        // INSERT INTO teams (owner_id, team_name, abbrev, city, state)
        // VALUES
        // (1$, $2, $3, $4, $5)`, [team.ownerId, team.teamName, team.abbrev, team.city, team.state]);
    }

    static async findOne(leagueName) {
        const {rows} = await pool.query(`
        SELECT *
        FROM leagues
        WHERE league_name = $1;`, [leagueName]);
        console.log("rows", rows)
        return rows[0];
    }

    static async find(leagueName) {
        if(!leagueName)
        {
            return []
        }
        const search = leagueName.toLowerCase();
        const {rows} = await pool.query(`
        SELECT *
        FROM leagues
        WHERE (LOWER(league_name) LIKE $1);`, [`%${search}%`]);
        console.log("rows", rows)
        return rows;
    }
}

export default Leagues;