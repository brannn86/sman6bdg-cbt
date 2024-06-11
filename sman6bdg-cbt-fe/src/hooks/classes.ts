import axios from '@/lib/axios'

export const useClasses: any = () => {
  const listClasses = async (
    props: IApiRequest
  ): Promise<ApiListDataPagination> => {
    const classess = await axios.get('api/classes', props)
    return classess.data.data.data
  }

  const createClasses = async (
    data: Classes,
    props: IApiRequest
  ): Promise<void> => {
    await axios.post('api/classes', data, props)
  }

  const findClasses = async (
    id: number,
    props: IApiRequest
  ): Promise<Classes> => {
    const classes = await axios.get(`api/classes/${id}`, props)
    return classes.data.data
  }

  const updateClasses = async (
    id: number,
    data: Classes,
    props: IApiRequest
  ): Promise<void> => {
    await axios.put(`api/classes/${id}`, data, props)
  }

  const deleteClasses = async (
    id: number,
    props: IApiRequest
  ): Promise<Classes> => {
    const classes = await axios.delete(`api/classes/${id}`, props)
    return classes.data.data
  }

  return {
    listClasses,
    createClasses,
    findClasses,
    updateClasses,
    deleteClasses
  }
}
