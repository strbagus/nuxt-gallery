import axios from 'axios'

export const MainService = axios.create({
  baseURL: 'http://localhost:3000/sample',
  timeout: 5000,
})


export const PhotoService = axios.create({
  baseURL: 'http://localhost:8083/api/gallery',
  timeout: 5000,
})
