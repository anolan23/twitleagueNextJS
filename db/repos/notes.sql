WITH record AS (
	SELECT
		count(*) as total_games,
		count(case when wins = true then 1 else null end) as wins,
		count(case when losses = true then 1 else null end) as losses
	FROM (
		SELECT points > opponent_points AS wins, points < opponent_points AS losses
		FROM events
		WHERE league_approved = true
	) AS results
)

SELECT teams.*, username AS owner, league_name, division_name, concat_ws(' ', to_char(teams.created_at, 'Mon'), to_char(teams.created_at, 'YYYY')) AS joined,
	(SELECT COUNT(*) AS num_posts
	FROM team_mentions
	WHERE team_id = teams.id),
	(SELECT total_games FROM record),
	(SELECT wins FROM record),
	(SELECT losses FROM record)
FROM teams
JOIN users ON teams.owner_id = users.id
LEFT JOIN leagues ON teams.league_id = leagues.id
LEFT JOIN divisions ON teams.division_id = divisions.id
WHERE abbrev = '$BAR'