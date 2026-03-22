import axios from "axios";

const API = axios.create({
  baseURL: "http://carhub-backend-production-39e4.up.railway.app/api"
});

export default API;
