import { toastHelper } from '@/helpers/toast-helper'
import axios, { csrf } from '@/lib/axios'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  user?: User | null
  token?: string | null
  getUser: () => Promise<void>
  updateUser: (user: User) => Promise<void>
  removeUser: () => void
  logIn: (credentials: Credentials) => Promise<void>
  logOut: () => Promise<void>
  updatePassword: (password: Password) => Promise<void>
  isRole: (roles: string | string[]) => boolean
}

const useAuthStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      // User Handlers
      getUser: async () => {
        try {
          const token = get().token

          if (token === null || token === undefined) {
            return
          }

          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          const responseData = await response.data

          if (response.status !== 200) throw new Error(responseData.message)

          const user = responseData.data.user

          set({ user })
        } catch (error) {
          toastHelper.error(error)
        }
      },
      updateUser: async (user: User) => {
        try {
          const token = get().token

          if (token === null || token === undefined)
            throw new Error('Token is not found')

          const response = await axios.post(
            '/api/auth/me',
            {
              ...user,
              ...user.profile,
              images: user.profile?.images_local?.[0],
              province_id: user.profile?.province?.id,
              regency_id: user.profile?.regency?.id,
              district_id: user.profile?.district?.id
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          )

          const responseData = response.data

          if (response.status !== 200) throw new Error(responseData.message)

          set((state) => ({
            user: {
              ...state.user,
              ...user,
              profile: {
                ...state.user?.profile,
                ...user.profile,
                province: {
                  ...state.user?.profile?.province,
                  ...user.profile?.province
                },
                regency: {
                  ...state.user?.profile?.regency,
                  ...user.profile?.regency
                },
                district: {
                  ...state.user?.profile?.district,
                  ...user.profile?.district
                }
              },
              roles: user.roles
            }
          }))
          toastHelper.success('Profile updated successfully.')
        } catch (error) {
          toastHelper.error(error)
        }
      },
      // Auth Handlers
      logIn: async (credentials: Credentials) => {
        try {
          await csrf()
          const response = await axios.post('/api/auth/login', {
            ...credentials
          })

          if (response.status !== 200) throw new Error(response.data.message)

          const token = response.data.data.token

          set({ token })
        } catch (error) {
          toastHelper.error(error)
        }
      },
      logOut: async () => {
        const token = get().token

        if (token === null || token === undefined) return

        try {
          await csrf()
          const response = await axios.post(
            '/api/auth/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          if (response?.status !== 200) throw new Error(response?.data.message)

          get().removeUser()
        } catch (error) {
          get().removeUser()
          toastHelper.error(error)
        }
      },
      removeUser: () => {
        set({ token: null })
        set({ user: null })
      },
      updatePassword: async (password) => {
        try {
          const token = get().token

          if (token === null || token === undefined)
            throw new Error('Token is not found')

          const response = await axios.post(
            'api/auth/me',
            {
              ...password
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const responseData = response.data

          if (response.status !== 200) throw new Error(responseData.message)
        } catch (error) {
          toastHelper.error(error)
        }
      },
      // Roles
      isRole: (isRole) => {
        const user = get().user

        if (user?.roles === undefined) return false

        const roles = user.roles.map((role) => role.name)

        if (Array.isArray(isRole)) {
          return isRole.some((role) => roles.includes(role))
        }

        return roles.includes(isRole)
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
)

export default useAuthStore
