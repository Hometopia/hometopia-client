import { format } from 'date-fns';
import { formatTimePartical } from './string';

const ISOtoLocal = (date: string) => {
  return new Date(date).toLocaleString()
}
const YYYYMMDDtoLocalDate = (date: string) => {
  return new Date(date).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
const stringToDate = (date: string) => {
  return new Date(date)
}
const dateToISOString = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}
const dateToYYYYMMDD = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
const getTime = (date: Date) => {
  return format(date, 'HH:mm:ss')
}
const calcYearAmount = (firstDate: Date, secondDate: Date) => {
  return new Date(firstDate).getFullYear() - new Date(secondDate).getFullYear()
}
const calcDuration = (startDate: Date, endDate: Date) => {
  const durationMs = endDate.getTime() - startDate.getTime()

  // Chuyển đổi milliseconds sang giờ, phút, giây
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)

  return `${formatTimePartical(hours)}:${formatTimePartical(minutes)}:${formatTimePartical(seconds)}`
}

export {
  ISOtoLocal,
  YYYYMMDDtoLocalDate,
  stringToDate,
  getTime,
  dateToISOString,
  dateToYYYYMMDD,
  calcYearAmount,
  calcDuration
}