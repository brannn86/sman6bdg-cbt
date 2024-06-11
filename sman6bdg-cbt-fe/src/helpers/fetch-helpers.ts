import axios from '@/lib/axios'
import { toastHelper } from './toast-helper'

export const getUser = async (): Promise<User> => {
  try {
    const response = await axios.get('/api/auth/me')

    const responseData = await response.data

    if (response.status !== 200) throw new Error(responseData.message)

    const user = responseData.data.user

    return user
  } catch (error) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message

    throw new Error(message)
  }
}

export const downloadFile = async (
  url: string,
  filename: string
): Promise<void> => {
  try {
    const exportFile = await axios.get(url, {
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        if (progressEvent.total === undefined) return

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )

        if (percentCompleted === 0) toastHelper.success('Download Started')
        else if (percentCompleted === 100)
          toastHelper.success('Download completed')
      }
    })

    const urlFile = window.URL.createObjectURL(new Blob([exportFile.data]))
    const link = document.createElement('a')
    link.href = urlFile
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    toastHelper.error(error)
  }
}
