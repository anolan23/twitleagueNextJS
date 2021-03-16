import pool  from "../pool";

class Database {
    static async updateById(id, table, columns) {
        const sqlQuery = () => {
            var query = [`UPDATE ${table}`];
            query.push('SET');

            var set = [];
            Object.keys(columns).forEach((column, index) => {
                set.push(column + ' = ($' + (index + 1) + ')'); 
            });
            query.push(set.join(', '));

            // Add the WHERE statement to look up by id
            query.push('WHERE id = ' + id );
            query.push('RETURNING *');

            // Return a complete query string
            return query.join(' ');
        }

        const {rows} = await pool.query(sqlQuery(), Object.values(columns));
        
        return rows[0];
    }
}

export default Database;