WITH record AS (
	SELECT team_id, season_id,
		count(*) AS current_season_total_games,
		count(case when outcome = 'W' then 1 else null end) AS current_season_wins,
		count(case when outcome = 'L' then 0 else null end) AS current_season_losses
	FROM
	(
	SELECT team_id as team_id, 
		CASE 
			WHEN points > opponent_points THEN 'W' 
			WHEN points < opponent_points THEN 'L'
			ELSE NULL 
			END 
		AS outcome, 
		season_id, points, opponent_points, league_approved 
		FROM events 
		UNION ALL
	SELECT opponent_id as team_id, 
		CASE 
			WHEN opponent_points > points THEN 'W' 
			WHEN opponent_points < points THEN 'L'
			ELSE NULL 
			END 
		AS outcome, 
		season_id, points, opponent_points, league_approved 
		FROM events
	) AS games
	JOIN teams ON teams.id = games.team_id
	WHERE league_approved = true
	GROUP BY team_id, season_id
)

	SELECT teams.*, username AS owner, leagues.league_name, division_name, leagues.season_id, 
	concat_ws(' ', to_char(teams.created_at, 'Mon'), 
			to_char(teams.created_at, 'YYYY')) AS joined,
			(SELECT COUNT(*) AS num_posts
			FROM team_mentions
			WHERE team_id = teams.id),
			(SELECT current_season_total_games FROM record WHERE team_id = teams.id AND season_id = leagues.season_id),
			(SELECT current_season_wins FROM record WHERE team_id = teams.id AND season_id = leagues.season_id),
			(SELECT current_season_losses FROM record WHERE team_id = teams.id AND season_id = leagues.season_id),
			(SELECT count(*) AS followers FROM followers WHERE team_id = teams.id),
			(SELECT count(*) AS players FROM rosters WHERE team_id = teams.id),
			EXISTS (SELECT 1 FROM followers WHERE followers.user_id = 11 AND teams.id = followers.team_id ) AS following
	FROM teams
	JOIN users ON teams.owner_id = users.id
	LEFT JOIN leagues ON teams.league_id = leagues.id
	LEFT JOIN divisions ON teams.division_id = divisions.id
	WHERE abbrev = '$CWS'