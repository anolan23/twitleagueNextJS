import pool  from "../pool";

class Rosters {
    static async create(teamId, userId) {
        const {rows} = await pool.query(`
        INSERT INTO rosters (team_id, user_id)
        VALUES ($1, $2)
        RETURNING *`, [teamId, userId]);
        return rows[0];
    }

    static async find(teamId) {
        const {rows} = await pool.query(`
        SELECT rosters.*, users.name, users.username, users.avatar
        FROM rosters
        JOIN teams ON teams.id = team_id
        JOIN users ON users.id = user_id
        WHERE team_id = $1`, [teamId]);
        return rows;
    }
}

export default Rosters;