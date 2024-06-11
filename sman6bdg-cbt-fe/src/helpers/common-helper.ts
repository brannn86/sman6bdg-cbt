import { format as formatDate, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export function calculateOffset(
  data: ApiListDataPagination,
  index: number
): number | undefined {
  if (data.current_page === undefined || data.per_page === undefined) {
    return undefined
  }

  return index + 1 + (data.current_page - 1) * data.per_page
}

export function formatTimezoneIso(
  date: string,
  timezone: string = 'Asia/Jakarta'
): string {
  return formatDate(
    utcToZonedTime(parseISO(date), timezone),
    "yyyy-MM-dd'T'HH:mm"
  )
}

export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}
