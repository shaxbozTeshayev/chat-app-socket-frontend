import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-task.onrender.com/api/",
});
