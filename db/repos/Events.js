import pool from "../pool";
import Database from "./Database";

class Events {
  static async createEvent(event) {
    const { homeTeamId, type, awayTeamId, date, location, notes, seasonId } =
      event;
    const { rows } = await pool.query(
      `
            INSERT INTO events (home_season_team_id, type, away_season_team_id, date, location, notes, season_id )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [homeTeamId, type, awayTeamId, date, location, notes, seasonId]
    );

    return rows[0];
  }

  static async find() {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM events`,
      []
    );

    return rows;
  }

  static async scores(seasonId) {
    const { rows } = await pool.query(
      `
      SELECT *,
      (
        SELECT row_to_json(home_team) AS home_team
        FROM (
          SELECT *
          FROM season_teams 
          WHERE id = events.home_season_team_id
        ) AS home_team
      ),
      (
        SELECT row_to_json(away_team) AS away_team
        FROM (
          SELECT *
          FROM season_teams 
          WHERE id = events.away_season_team_id
        ) AS away_team
      ),
        ABS(EXTRACT(EPOCH FROM (current_timestamp - date))) AS seconds_from_now
      FROM events
      WHERE season_id = $1 AND events.type = 'game'
      ORDER BY seconds_from_now
      LIMIT 2`,
      [seasonId]
    );

    return rows;
  }

  static async findEventsByTeamId(teamId) {
    const { rows } = await pool.query(
      `
        SELECT events.*, to_char(events.date, 'Mon') AS month, to_char(events.date, 'DD') AS day, 
        to_char(events.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t1.owner_id AS team_owner_id, 
        t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar, 
        t2.owner_id AS opponent_owner_id,
        (SELECT COUNT(*) FROM posts WHERE event_conversation_id = events.id) AS replies,
        EXISTS (SELECT 1 FROM event_likes WHERE event_likes.user_id = $2 AND events.id = event_likes.event_id ) AS liked,
        (SELECT COUNT(*) FROM event_likes WHERE event_id = events.id) AS likes
        FROM events
        LEFT JOIN season_teams AS t1 ON events.home_season_team_id = t1.id
        LEFT JOIN season_teams AS t2 ON events.away_season_team_id = t2.id
        WHERE events.home_season_team_id = $1 OR events.away_season_team_id = $1
        ORDER BY date`,
      [teamId]
    );

    return rows;
  }

  static async findTeamEvents({ abbrev, seasonId, userId }) {
    const { rows } = await pool.query(
      `
      SELECT events.*, 
      (
          SELECT row_to_json(home_team) AS home_team
          FROM (
            SELECT *
            FROM season_teams 
            WHERE id = events.home_season_team_id
          ) AS home_team
        ),
        (
          SELECT row_to_json(away_team) AS away_team
          FROM (
            SELECT *
            FROM season_teams 
            WHERE id = events.away_season_team_id
          ) AS away_team
        ),
        (SELECT COUNT(*) FROM posts WHERE event_conversation_id = events.id) AS replies,
        (SELECT COUNT(*) FROM event_likes WHERE event_id = events.id) AS likes,
        EXISTS (SELECT 1 FROM event_likes WHERE event_likes.user_id = $3 AND events.id = event_likes.event_id ) AS liked
      FROM events
      LEFT JOIN season_teams AS t1 ON events.home_season_team_id = t1.id
      LEFT JOIN season_teams AS t2 ON events.away_season_team_id = t2.id
      WHERE (t1.abbrev = $1 OR t2.abbrev = $1) AND events.season_id = $2
      ORDER BY date`,
      [abbrev, seasonId, userId]
    );

    return rows;
  }

  static async findOneEventById(eventId, userId) {
    const { rows } = await pool.query(
      `
      SELECT events.*, 
        (
          SELECT row_to_json(season) AS season
          FROM (
          SELECT seasons.*,
          (
            SELECT row_to_json(league) AS league
            FROM (
              SELECT leagues.*
              FROM leagues
              WHERE leagues.id = seasons.league_id
            ) AS league
          )
          FROM seasons
          WHERE id = events.season_id
          ) AS season
        ),
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
        ),
        (SELECT COUNT(*) FROM event_likes WHERE event_id = events.id) AS likes,
        EXISTS (SELECT 1 FROM event_likes WHERE event_likes.user_id = $2 AND events.id = event_likes.event_id ) AS liked
      FROM events
      LEFT JOIN season_teams AS t1 ON events.home_season_team_id = t1.id
      LEFT JOIN season_teams AS t2 ON events.away_season_team_id = t2.id
      LEFT JOIN leagues ON t1.league_id = leagues.id
      WHERE events.id = $1`,
      [eventId, userId]
    );

    return rows[0];
  }

  static async updateEvent(eventId, values) {
    const { rows } = await pool.query(
      `
        WITH updated_event as
        ( 
            ${Database.updateById(eventId, "events", values)}
        )

        SELECT updated_event.*, leagues.owner_id, leagues.league_name, to_char(updated_event.date, 'Mon') AS month, 
        to_char(updated_event.date, 'DD') AS day, to_char(updated_event.date, 'HH12:MIAM') AS time, 
        t1.team_name, t1.abbrev, t1.avatar, t1.owner_id AS team_owner_id,
        t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar, 
        t2.owner_id AS opponent_owner_id
        FROM updated_event
        LEFT JOIN season_teams AS t1 ON updated_event.home_season_team_id = t1.id
        LEFT JOIN season_teams AS t2 ON updated_event.away_season_team_id = t2.id
        LEFT JOIN leagues ON t1.league_id = leagues.id`,
      Object.values(values)
    );

    return rows[0];
  }

  static async like(eventId, userId) {
    const { rows } = await pool.query(
      `
        INSERT INTO event_likes (event_id, user_id)
        VALUES ($1, $2)
        RETURNING *`,
      [eventId, userId]
    );
    return rows;
  }

  static async unLike(eventId, userId) {
    const { rows } = await pool.query(
      `
      DELETE FROM event_likes
      WHERE event_id = $1 AND user_id = $2
      RETURNING *`,
      [eventId, userId]
    );
    return rows;
  }

  static async findUsersWhoLiked(eventId) {
    const { rows } = await pool.query(
      `
    SELECT event_likes.*, users.name, users.username, users.avatar
    FROM event_likes
    JOIN users ON users.id = user_id
    WHERE event_id = $1
    `,
      [eventId]
    );

    return rows;
  }

  static async findScheduleByLeagueName(leagueName) {
    const { rows } = await pool.query(
      `
      WITH league_data AS (
        SELECT *
        FROM leagues
        WHERE league_name = $1
      )
      SELECT 
        (
        SELECT jsonb_agg(nested_team)
        FROM (
          SELECT *
          FROM season_teams
          WHERE season_id = (SELECT season_id FROM league_data)
          ORDER BY team_name
        ) AS nested_team
        ) AS teams,
        (
        SELECT jsonb_agg(nested_event)
        FROM (
          SELECT *,
          (
            SELECT row_to_json(home_team) AS home_team
            FROM (
            SELECT *
            FROM season_teams 
            WHERE id = events.home_season_team_id
            ) AS home_team
          ),
          (
            SELECT row_to_json(away_team) AS away_team
            FROM (
            SELECT *
            FROM season_teams 
            WHERE id = events.away_season_team_id
            ) AS away_team
          )	
          FROM events
          WHERE season_id = (SELECT season_id FROM league_data)
          ORDER BY events.date
        ) AS nested_event
        ) AS events,
        (
        SELECT jsonb_agg(nested_season)
        FROM (
          SELECT *
          FROM seasons
          WHERE league_id = (SELECT id FROM league_data)
          ORDER BY created_at
        ) AS nested_season
        ) AS seasons
    `,
      [leagueName]
    );

    return rows[0];
  }

  static async findScheduleBySeasonId(seasonId) {
    const { rows } = await pool.query(
      `
      WITH league_data AS (
        SELECT leagues.id
        FROM seasons
        JOIN leagues ON leagues.id = seasons.league_id
        WHERE seasons.id = $1
      )
      SELECT 
        (
        SELECT jsonb_agg(nested_teams)
        FROM (
          SELECT *
          FROM season_teams
          WHERE season_id = $1
          ORDER BY team_name
        ) AS nested_teams
        ) AS teams,
        (
        SELECT jsonb_agg(nested_event)
        FROM (
          SELECT *,
            (
              SELECT row_to_json(home_team) AS home_team
              FROM (
                SELECT *
                FROM season_teams 
                WHERE id = events.home_season_team_id
              ) AS home_team
            ),
            (
              SELECT row_to_json(away_team) AS away_team
              FROM (
                SELECT *
                FROM season_teams 
                WHERE id = events.away_season_team_id
              ) AS away_team
            )	
          FROM events
          WHERE season_id = $1
          ORDER BY events.date
        ) AS nested_event
        ) AS events,
        (
        SELECT jsonb_agg(nested_season)
        FROM (
          SELECT *
          FROM seasons
          WHERE league_id = (SELECT id FROM league_data)
          ORDER BY created_at
        ) AS nested_season
        ) AS seasons
    `,
      [seasonId]
    );

    return rows[0];
  }
}

export default Events;
