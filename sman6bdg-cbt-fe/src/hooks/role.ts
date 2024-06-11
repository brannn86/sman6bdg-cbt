import axios from '@/lib/axios'

export const useRole: any = () => {
  const listRole = async (props: IApiRequest): Promise<any> => {
    const roles = await axios.get('api/roles', props)
    return roles.data.data.data
  }

  return {
    listRole
  }
}
