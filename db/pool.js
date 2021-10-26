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
    return "postgres://zaqshrnkoddgui:77cf7e12d6e458c3b42e40e5db54844be4e045852cf203f94057b5ccfd748ecf@ec2-54-172-169-87.compute-1.amazonaws.com:5432/d4q9qkfjsq5fvm?sslmode=require";
  }
};

const pool = new pg.Pool(options());
console.log(pool);

export default pool;
