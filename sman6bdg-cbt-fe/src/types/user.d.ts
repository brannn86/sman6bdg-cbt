interface Credentials {
  username: string
  password: string
}

interface User {
  id: number | null
  email: string
  username: string
  email_verified_at?: string
  must_verify_email?: boolean // this is custom attribute
  created_at?: string
  updated_at?: string
  province_id?: number
  regency_id?: number
  district_id?: number
  profile?: UserProfile
  roles?: Role[]
  classes?: Classes[]
}

interface UserProfile {
  id?: number | null
  user_id?: number | null
  name?: string
  images?: string
  images_local?: FileList
  image_path?: string
  phone?: string
  address?: string
  postal_code?: string
  province?: Region
  regency?: Region
  district?: Region
}

interface Role {
  id?: number | null
  guard_name?: string
  name: string
}

interface Password {
  password: string
  password_confirmation: string
}

interface UserPagination extends Omit<ApiListDataPagination, 'data'> {
  data: User[]
}
