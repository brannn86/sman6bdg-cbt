import axios from '@/lib/axios'
// import { useEffect } from 'react'
// import { useRouter } from 'next/router'

// declare type UserMiddleware = 'auth'

// interface IUseUser {
//   middleware: UserMiddleware
//   redirectIfAuthenticated?: string
// }

export const useRegional: any = (): {
  listProvince: (args: IApiRequest) => Promise<any>
  listRegency: (provinceId: number, args: IApiRequest) => Promise<any>
  listDistrict: (provinceId: number, args: IApiRequest) => Promise<any>
} => {
  const listProvince = async (props: IApiRequest): Promise<any> => {
    const provinces = await axios.get('api/regional/provinces', props)
    return provinces.data.data.provinces
  }

  const listRegency = async (
    provinceId: number,
    props: IApiRequest
  ): Promise<any> => {
    const regencies = await axios.get(
      `api/regional/regencies/${provinceId}`,
      props
    )
    return regencies.data.data.regencies
  }

  const listDistrict = async (
    regencyId: number,
    props: IApiRequest
  ): Promise<any> => {
    const districts = await axios.get(
      `api/regional/districts/${regencyId}`,
      props
    )
    return districts.data.data.districts
  }

  return {
    listProvince,
    listRegency,
    listDistrict
  }
}

export default useRegional
