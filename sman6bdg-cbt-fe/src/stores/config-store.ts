import { toastHelper } from '@/helpers/toast-helper'
import axios from '@/lib/axios'
import { create } from 'zustand'

interface State {
  logo: string | null
  getLogo: () => Promise<void>
  updateLogo: (file: File) => Promise<void>
}

const useConfigStore = create<State>()((set) => ({
  logo: null,
  getLogo: async () => {
    try {
      const response = await axios.get('/api/config/logo_image')
      const responseData = await response.data

      set({ logo: responseData.data.image_path })
    } catch (error) {
      toastHelper.error(error)
    }
  },
  updateLogo: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('logo_image', file)
      const response = await axios.post('/api/config/logo_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const responseData = await response.data

      set({ logo: responseData.data.image_path })
      toastHelper.success('Logo berhasil diubah')
    } catch (error) {
      toastHelper.error(error)
    }
  }
}))

export default useConfigStore
