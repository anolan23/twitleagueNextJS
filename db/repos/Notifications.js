import pool from "../pool";

class Notifications {
    
    static async findByUserId(userId) {
        const notifications = await pool.query(`
        SELECT type, team_name, league_name, username AS player
        FROM notifications
        LEFT JOIN users ON users.id = player_id
        LEFT JOIN teams ON teams.id = team_id
        LEFT JOIN leagues ON leagues.id = notifications.league_id
        WHERE notifications.user_id = $1`, [userId]);
        return notifications.rows;
    }

    static async sendJoinTeamRequest(joinTeamRequest) {
        const {userId, type, teamId, playerId} = joinTeamRequest;
        const notification = await pool.query(`
        INSERT INTO notifications (user_id, type, team_id, player_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, [userId, type, teamId, playerId]);
        return notification.rows[0];
    }

    static async delete(notificationId) {
        const notifications = await pool.query(`
        DELETE FROM notifications
        WHERE id = $1`, [notificationId]);
        return notifications.rows;
    }
}

export default Notifications;