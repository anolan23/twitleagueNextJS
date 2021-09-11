import pool from "../pool";

class Notifications {
  static async findByUserId(userId) {
    const notifications = await pool.query(
      `
      SELECT notifications.*,
        (
          SELECT row_to_json(recipient) AS recipient
          FROM (
            SELECT id, created_at, updated_at, name, email, username, dob, avatar, bio
            FROM users
            WHERE id = notifications.user_id
          ) AS recipient
        ),
        (
          SELECT row_to_json(sender) AS sender
          FROM (
            SELECT id, created_at, updated_at, name, email, username, dob, avatar, bio
            FROM users
            WHERE id = notifications.sender_id
          ) AS sender
        ),
        (
          SELECT row_to_json(team) AS team
          FROM (
            SELECT *
            FROM teams
            WHERE id = notifications.team_id
          ) AS team
        ),
        (
          SELECT row_to_json(league) AS league
          FROM (
            SELECT *
            FROM leagues
            WHERE id = notifications.league_id
          ) AS league
        ),
        (
          SELECT row_to_json(event) AS event
          FROM (
            SELECT events.*,
            (
              SELECT row_to_json(home_season_team) AS home_season_team
              FROM (
                SELECT *
                FROM season_teams
                WHERE id = events.home_season_team_id
              ) AS home_season_team
            ),
            (
              SELECT row_to_json(away_season_team) AS away_season_team
              FROM (
                SELECT *
                FROM season_teams
                WHERE id = events.away_season_team_id
              ) AS away_season_team
            )
            FROM events
            WHERE id = notifications.event_id
          ) AS event
        )
      FROM notifications
      WHERE notifications.user_id = $1
      ORDER BY notifications.created_at DESC`,
      [userId]
    );

    return notifications.rows;
  }

  static async send(notification) {
    const { type, user_id, sender_id, team_id, league_id, event_id } =
      notification;
    const results = await pool.query(
      `
        INSERT INTO notifications (type, user_id, sender_id, team_id, league_id, event_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [type, user_id, sender_id, team_id, league_id, event_id]
    );

    return results.rows[0];
  }

  static async delete(notificationId) {
    const notifications = await pool.query(
      `
        DELETE FROM notifications
        WHERE id = $1
        RETURNING *`,
      [notificationId]
    );

    return notifications.rows[0];
  }
}

export default Notifications;
