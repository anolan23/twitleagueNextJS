import pg from "pg"

const options = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return {
            user: 'aaron',
            host: 'localhost',
            database: 'twitleague',
            password: '',
            port: 5432,
        };
    } else {
        return {
            user: 'twitleague',
            host: 'twitleague.chynzy0qazsi.us-east-2.rds.amazonaws.com',
            database: 'twitleague',
            password: 'Beta095458!',
            port: 5432,
        }
    }
}

const pool = new pg.Pool(options());

export default pool;
