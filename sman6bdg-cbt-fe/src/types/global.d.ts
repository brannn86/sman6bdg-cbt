interface ApiListDataPagination {
  data?: unknown[]
  current_page?: number
  first_page_url?: string
  from?: number
  last_page?: number
  last_page_url?: string
  links?: object
  next_page_url?: string
  path?: string
  per_page?: number
  prev_page_url?: number
  to?: number
  total?: number
}

interface ReactSelectOption {
  value: string | number | object
  label: string | undefined
}

interface IApiRequest {
  params?: any
  headers?: any
}

type time = 'pagi' | 'siang' | 'malam'
