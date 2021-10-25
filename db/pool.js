import pg from "pg";

const options = () => {
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
      user: "idmblski",
      host: "fanny.db.elephantsql.com",
      database: "idmblski",
      password: "gMwWSlDnvGizIuMQDWtbblbFrfCyIlvp",
      port: 5432,
    };
  }
};

const pool = new pg.Pool(options());

export default pool;
