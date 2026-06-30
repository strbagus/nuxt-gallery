import axios from 'axios'

export const MainService = axios.create({
  baseURL: `${import.meta.env.VITE_SAMPLE_API}`,
  timeout: 5000,
})


export const PhotoService = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 5000,
})
