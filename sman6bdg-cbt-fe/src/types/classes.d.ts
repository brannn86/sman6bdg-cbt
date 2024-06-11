interface Classes {
  id: number
  name: string
}

interface ClassesPagination extends Omit<ApiListDataPagination, 'data'> {
  data: Classes[]
}
