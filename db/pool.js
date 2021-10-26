import pg from "pg";
import axios from "axios";

async function getDatabaseURL() {
  const results = await axios.get(
    "https://api.heroku.com/apps/twitleague-db/config-vars",
    {
      headers: {
        Accept: "application/vnd.heroku+json; version=3",
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`,
      },
    }
  );
  return results.data.DATABASE_URL;
}

getDatabaseURL();

const options = async () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return {
      user: "aaron",
      host: "localhost",
      database: "twitleague",
      password: "",
      port: 5432,
    };
  } else {
    return {
      connectionString: await getDatabaseURL(),
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
};

const pool = new pg.Pool(options());

export default pool;
