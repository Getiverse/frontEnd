import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export const generateArrayOfDays = (start: number, end: number) => {
  const arr = []
  for (let i = start; i <= end; i++) {
    arr.push(i)
  }

  return arr
}

export const generateArrayOfYears = (start: number, end: number) => {
  const arr = []
  for (let i = start; i <= end; i++) {
    arr.push(i)
  }

  return arr.map((item: number) => dayjs().year(item).format('YYYY'))
}

export const getFirstElementsInArray = (array = [], size = 0) => {
  return array.slice(0, size)
}

export const getLastElementsInArray = (array = [], size = 0) => {
  return array.slice(Math.max(array.length - size, 0))
}

export const getFormattedWeekDays = (i18n: string) => {
  return Array.from(Array(7).keys()).map((num) => {
    return dayjs().locale(i18n).day(num).format('ddd')
  })
}

export const getLastDaysOfMonth = (date: Dayjs, size = 0) => {
  return getLastElementsInArray(getDaysInMonth(date) as never, size)
}

export const getFirstDaysOfMonth = (date: Dayjs, size = 0) => {
  return getFirstElementsInArray(getDaysInMonth(date) as never, size)
}

export const getFormattedMonth = (date: Dayjs, i18n: string) => {
  return dayjs(date).locale(i18n).format('MMMM').toUpperCase()
}

export const getFormattedMonthAndYear = (date: Dayjs, i18n: string) => {
  return dayjs(date).locale(i18n).format('MMMM YYYY').toUpperCase()
}

export const getFormattedMonths = (i18n: string, format = 'MMM') => {
  return Array.from(Array(12).keys()).map((number: number) =>
    dayjs(`2022-${1 + number}-01`)
      .locale(i18n)
      .format(format)
      .toUpperCase()
  )
}

export const getDaysInMonth = (date: string | Dayjs = dayjs()): number[] => {
  return [...generateArrayOfDays(1, dayjs(date).daysInMonth())]
}

export const getNextMonth = (date: Dayjs) => {
  return date.month(date.month() + 1)
}

export const getPreviousMonth = (date: Dayjs) => {
  return date.month(date.month() - 1)
}

export const generateHoursMinutesAndSeconds = (): {
  hours: string[]
  minutes: string[]
  seconds: string[]
} => {
  const hours = Array.from(Array(25).keys())
    .slice(1, 24)
    .map((hour) => (hour.toString().length < 2 ? `0${hour}` : hour.toString()))

  const minutes = Array.from(Array(61).keys())
    .slice(0, 60)
    .map((minute) =>
      minute.toString().length < 2 ? `0${minute}` : minute.toString()
    )

  const seconds = Array.from(Array(61).keys())
    .slice(0, 61)
    .map((seconds) =>
      seconds.toString().length < 2 ? `0${seconds}` : seconds.toString()
    )

  return { hours, minutes, seconds }
}
