import pool  from "../pool";

class Leagues {

    static async create(leagueData) {
        const {ownerId, leagueName, sport} = leagueData;
        const {rows} = await pool.query(`
        INSERT INTO leagues (owner_id, league_name, sport)
        VALUES
        ($1, $2, $3)`, [ownerId, leagueName, sport]);
    }

    static async findOne(leagueName) {
        const {rows} = await pool.query(`
        SELECT *
        FROM leagues
        WHERE league_name = $1;`, [leagueName]);
        console.log("rows", rows)
        return rows[0];
    }

    static async findByOwnerId(ownerId) {
        const leagues = await pool.query(`
        SELECT *
        FROM leagues
        WHERE owner_id = $1`, [ownerId]);
        return leagues.rows;
    }

    static async find() {
        const leagues = await pool.query(`
        SELECT *
        FROM leagues
        `);
        return leagues.rows;
    }

    static async findAllLike(leagueName) {
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