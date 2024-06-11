import { toastHelper } from '@/helpers/toast-helper'
import axios from '@/lib/axios'

import { create } from 'zustand'

interface State {
  provinces: { isLoading: boolean; data: Region[] }
  regencies: { isLoading: boolean; data: Region[] }
  districts: { isLoading: boolean; data: Region[] }
  getProvinces: () => Promise<void>
  getRegencies: (id: number) => Promise<void>
  getDistricts: (id: number) => Promise<void>
  resetProvinces: () => void
  resetRegencies: () => void
  resetDistricts: () => void
}

const useRegionStore = create<State>()((set, get) => ({
  provinces: { isLoading: false, data: [] },
  regencies: { isLoading: false, data: [] },
  districts: { isLoading: false, data: [] },
  getProvinces: async () => {
    try {
      set((state) => ({
        ...state,
        provinces: { ...state.provinces, isLoading: true }
      }))

      const response = await axios.get('/api/regional/provinces')

      const responseData = await response.data

      if (response.status !== 200) throw new Error(responseData.message)

      const provinces = responseData.data.provinces

      set((state) => ({
        ...state,
        provinces: { isLoading: false, data: provinces }
      }))
    } catch (error) {
      toastHelper.error(error)
    }
  },
  getRegencies: async (id: number) => {
    try {
      set((state) => ({
        ...state,
        regencies: { ...state.regencies, isLoading: true }
      }))

      const response = await axios.get(`/api/regional/regencies/${id}`)

      const responseData = await response.data

      if (response.status !== 200) throw new Error(responseData.message)

      const regencies = responseData.data.regencies

      set((state) => ({
        ...state,
        regencies: { isLoading: false, data: regencies }
      }))
    } catch (error) {
      toastHelper.error(error)
    }
  },
  getDistricts: async (id: number) => {
    try {
      set((state) => ({
        ...state,
        districts: { ...state.districts, isLoading: true }
      }))

      const response = await axios.get(`/api/regional/districts/${id}`)

      const responseData = await response.data

      if (response.status !== 200) throw new Error(responseData.message)

      const districts = responseData.data.districts

      set((state) => ({
        ...state,
        districts: { isLoading: false, data: districts }
      }))
    } catch (error) {
      toastHelper.error(error)
    }
  },
  resetProvinces: () => {
    set((state) => ({
      ...state,
      provinces: { isLoading: false, data: [] }
    }))
  },
  resetRegencies: () => {
    set((state) => ({
      ...state,
      regencies: { isLoading: false, data: [] }
    }))
  },
  resetDistricts: () => {
    set((state) => ({
      ...state,
      districts: { isLoading: false, data: [] }
    }))
  }
}))

export default useRegionStore
