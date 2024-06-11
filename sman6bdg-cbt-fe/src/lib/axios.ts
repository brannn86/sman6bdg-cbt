import useAuthStore from '@/stores/auth-store'
import Axios from 'axios'
import { i18n } from 'next-i18next'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const axios = Axios.create({
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
  },
  baseURL
})

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  const currentLanguage = i18n?.language

  if (token !== null && token !== undefined) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (currentLanguage !== null && currentLanguage !== undefined) {
    config.headers['Accept-Language'] = currentLanguage
  }

  return config
})

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().removeUser()
    }
    throw error
  }
)

export const csrf = async (): Promise<void> => {
  await axios.get(baseURL + '/sanctum/csrf-cookie')
}

export default axios
