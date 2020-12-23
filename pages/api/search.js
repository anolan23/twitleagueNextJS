import pool from "../../db/pool";


export default async (req,res) => {
    let searchTerm = req.query.searchTerm; 
    let users;
    let teams;
    // const teamSearchTerm = searchTerm.replace("$", "\\$&");
    // const teamRegExp = new RegExp("^"+ teamSearchTerm);
    // const userSearchTerm = searchTerm.replace("@", "")
    // const userRegexp = new RegExp("^"+ userSearchTerm);
    if(!searchTerm)
    {
        return []
    }
    await (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            searchTerm = searchTerm.toLowerCase();
            users = await client.query(
                `
                SELECT *
                FROM users
                WHERE (LOWER(username) LIKE $1)
                LIMIT 5;`, [`%${searchTerm}%`]
          )
            teams = await client.query(
              `
              SELECT *
              FROM teams
              WHERE (LOWER(team_name) LIKE $1)
              LIMIT 5;`, [`%${searchTerm}%`]
            )  
          await client.query('COMMIT')
          
        } catch (e) {
          await client.query('ROLLBACK')
          throw e
        } finally {
          client.release()
        }

      })().catch(e => console.error(e.stack))
      res.send({users: users.rows, teams: teams.rows}); 
}