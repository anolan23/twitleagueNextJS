import pool from "../pool";

class Followers {

    static async findByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT * 
        FROM followers
        JOIN users ON followers.user_id = users.id
        WHERE team_id = $1`, [teamId]);
        return rows;
    }
}

export default Followers;