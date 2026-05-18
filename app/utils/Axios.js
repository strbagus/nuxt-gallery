import axios from "axios"

export const MainService = axios.create({
  baseURL: "http://localhost:3000/sample",
  timeout: 5000
})
