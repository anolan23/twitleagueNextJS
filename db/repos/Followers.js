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

    static async findAllTeamsFollowed(userId) {
        const {rows} = await pool.query(`
        SELECT *
        FROM followers
        WHERE user_id = $1`, [userId]);
        
        return rows;
    }

    static async follow (teamId, userId) {
        const {rows} = await pool.query(`
        INSERT INTO followers (team_id, user_id)
        VALUES ($1, $2)
        RETURNING *`, [teamId, userId]);
        
        return rows[0];
    }

    static async unFollow (teamId, userId) {
        const {rows} = await pool.query(`
        DELETE FROM followers 
        WHERE team_id = $1 AND user_id = $2
        RETURNING *`, [teamId, userId]);
        
        return rows[0];
    }


}

export default Followers;