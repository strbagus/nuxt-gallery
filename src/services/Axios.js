import axios from "axios"

export const MainService = axios.create({
  baseURL: "http://localhost:5173/sample",
  timeout: 5000
})
