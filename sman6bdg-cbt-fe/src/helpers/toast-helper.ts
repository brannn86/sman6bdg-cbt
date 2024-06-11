import { AxiosError } from 'axios'
import { type ToastOptions, toast } from 'react-toastify'

const defaultOptionToast = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true
}

interface IToastHelper {
  success: (message: string, options?: ToastOptions | undefined | null) => void
  error: (error: unknown, options?: ToastOptions | undefined | null) => void
  warning: (message: string, options?: ToastOptions | undefined | null) => void
  info: (message: string, options?: ToastOptions | undefined | null) => void
  loading: (message: string, options?: ToastOptions | undefined | null) => void
}

export const toastHelper: IToastHelper = {
  // replace defaultOptionToast with your own options per key
  success: (message, options = null) => {
    toast.success(message, { ...defaultOptionToast, ...options })
  },

  error: (error, options = null) => {
    let message = 'Unknown Error'

    if (typeof error === 'string') {
      message = error
    } else if (error instanceof AxiosError) {
      message = error.response?.data?.message ?? error.message
    } else if (error instanceof Error) {
      message = error.message
    }

    toast.error(message, { ...defaultOptionToast, ...options })
  },

  warning: (message, options = null) => {
    toast.warning(message, { ...defaultOptionToast, ...options })
  },

  info: (message, options = null) => {
    toast.info(message, { ...defaultOptionToast, ...options })
  },

  loading: (message, options = null) => {
    toast.loading(message, { ...defaultOptionToast, ...options })
  }
}
