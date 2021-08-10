import axios from "axios";

const baseURL = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    return "https://twitleague-next-js.vercel.app";
  }
};

export default axios.create({
  baseURL: baseURL(),
  withCredentials: true,
  credentials: "include",
});
