import pool from "../pool";

class Notifications {
    
    static async findByUserId(userId) {
        const notifications = await pool.query(`
        SELECT notifications.id, type, notifications.user_id, username, notifications.team_id, teams.team_name, teams.abbrev, teams.avatar AS team_avatar, notifications.league_id, league_name
        FROM notifications
        LEFT JOIN users ON users.id = notifications.user_id
        LEFT JOIN teams ON teams.id = team_id
        LEFT JOIN leagues ON leagues.id = notifications.league_id
        WHERE notifications.user_id = $1`, [userId]);
        
        return notifications.rows;
    }

    static async sendJoinTeamInvite(joinTeamInvite) {
        const {userId, type, teamId} = joinTeamInvite;
        const notification = await pool.query(`
        INSERT INTO notifications (user_id, type, team_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [userId, type, teamId]);
        
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