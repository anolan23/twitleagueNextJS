import pool from "../pool";

class Posts {
    static async create(post, abbrevs) {
        let results;
        await (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                results = await client.query(
                  `INSERT INTO posts (author_id, body, gif, outlook)
                  VALUES
                  ($1, $2, $3, $4)
                  RETURNING *`, [post.userId, post.body, post.gif, post.outlook]
              )

              if(abbrevs){
                  abbrevs.forEach(async abbrev => {
                      const team = await client.query(
                          `SELECT id
                          FROM teams
                          WHERE abbrev = $1`, [abbrev]
                      )
                      const insertTeamMention = await client.query(
                          `INSERT INTO team_mentions (team_id, post_id)
                          VALUES ($1, $2)`, [team.rows[0].id, results.rows[0].id]
                      )
                  });
              }
              await client.query('COMMIT')
              
            } catch (e) {
              await client.query('ROLLBACK')
              throw e
            } finally {
              client.release()
            }

          })().catch(e => console.error(e.stack))
          return results.rows[0]
    }

    static async findByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT team_id, posts.created_at, users.name, users.username, body, gif, outlook
        FROM team_mentions
        JOIN posts ON team_mentions.post_id = posts.id
        JOIN users ON posts.author_id = users.id
        WHERE team_id = $1`, [teamId]);
        return rows;
    }


}

export default Posts;