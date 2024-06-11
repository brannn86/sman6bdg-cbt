import axios from '@/lib/axios'
// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
// declare type UserMiddleware = 'auth'

// interface IUseUser {
//   middleware: UserMiddleware
//   redirectIfAuthenticated?: string
// }

export const useUser: any = () => {
  const listUser = async (
    props: IApiRequest
  ): Promise<ApiListDataPagination> => {
    const users = await axios.get('api/users', props)
    return users.data.data.data
  }

  const createUser = async (data: User, props: IApiRequest): Promise<User> => {
    const user = await axios.post('api/users', data, props)
    return user.data.data
  }

  const findUser = async (id: number, props: IApiRequest): Promise<User> => {
    const user = await axios.get(`api/users/${id}`, props)
    return user.data.data
  }

  const updateUser = async (
    id: number,
    data: User,
    props: IApiRequest
  ): Promise<User> => {
    const user = await axios.post(`api/users/${id}`, data, props)
    return user.data.data
  }

  const deleteUser = async (id: number, props: IApiRequest): Promise<User> => {
    const user = await axios.delete(`api/users/${id}`, props)
    return user.data.data
  }

  return {
    listUser,
    createUser,
    findUser,
    updateUser,
    deleteUser
  }
}
