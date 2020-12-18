import pg from "pg"

const pool = new pg.Pool({
    user: 'aaron',
    host: 'localhost',
    database: 'twitleague',
    password: '',
    port: 5432,
})

export default pool;
