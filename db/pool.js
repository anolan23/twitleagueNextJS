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
      user: "zaqshrnkoddgui",
      host: "ec2-54-172-169-87.compute-1.amazonaws.com",
      database: "d4q9qkfjsq5fvm",
      password:
        "77cf7e12d6e458c3b42e40e5db54844be4e045852cf203f94057b5ccfd748ecf",
      port: 5432,
    };
  }
};

const pool = new pg.Pool(options());

export default pool;
