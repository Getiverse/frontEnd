import type { FC } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import classNames from 'classnames'
import { useDatetimePickerContext } from '../contexts/DatetimePickerContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { useCallback, useState } from 'react'
import {
  generateArrayOfYears,
  getFormattedMonths,
  getFormattedWeekDays,
  getNextMonth,
  getPreviousMonth,
} from '../utils/dateUtils'

import { Selector } from './Selector'
import { loadI18n } from '../utils/i18nUtils'
import { CalendarProps, DisabledDate, ThemeBoolReturnType } from '../types';
import { deepMerge } from '../utils/deepMerge'

dayjs.extend(isBetween)

export const Calendar: FC<CalendarProps> = ({
  onNextClick,
  onSelectorClick,
  onPreviousClick,
  onSelectMonth,
  onSelectYear,
  selectorOpen,
  data,
}) => {
  const {
    i18n,
    range,
    updateRange,
    hoveredDate,
    updateHoveredDate,
    maxDate,
    minDate,
    disabledDates,
    useSingleValue,
    customTheme,
  } = useDatetimePickerContext()
  loadI18n(i18n)

  const [yearInterval, setYearInterval] = useState(dayjs().year())

  const handleNextYearsClick = useCallback(() => {
    setYearInterval((p) => p + 13)
  }, [])

  const handlePreviousYearsClick = useCallback(() => {
    setYearInterval((p) => p - 13)
  }, [])

    const theme = deepMerge(
    useThemeContext().theme.calendar,
    customTheme?.calendar ?? {}
  )

  /**
   * Resolves date is earlier than minDate
   */
  const resolveDateTooEarly = useCallback(
    (day: number, type: 'previous' | 'current' | 'next') => {
      if (!minDate) return false

      const dates = {
        previous: getPreviousMonth(data.date),
        current: data.date,
        next: getNextMonth(data.date),
      }

      const nextDate = dates[type].date(day)
      return nextDate.isSame(minDate) ? false : nextDate.isBefore(minDate)
    },
    [data.date, minDate]
  )

  /**
   * Resolves date is later than maxDate
   */
  const resolveDateTooLate = useCallback(
    (day: number, type: 'previous' | 'current' | 'next') => {
      if (!maxDate) return false

      const dates = {
        previous: getPreviousMonth(data.date),
        current: data.date,
        next: getNextMonth(data.date),
      }

      const nextDate = dates[type].date(day)

      return nextDate.isSame(maxDate) ? false : nextDate.isAfter(maxDate)
    },
    [data.date, maxDate]
  )

  /**
   * Resolves disabled dates
   */
  const resolveDisabledDates = useCallback(
    (day: number, type: 'previous' | 'current' | 'next'): boolean => {
      if (!disabledDates) return false
      const dates = {
        previous: getPreviousMonth(data.date),
        current: data.date,
        next: getNextMonth(data.date),
      }

      const nextDate = dates[type].date(day)

      return disabledDates
        .map((disabledDate: DisabledDate) => {
          if (dayjs(disabledDate).isSame(nextDate, 'date')) return true
          return false
        })
        .some((value: boolean) => value === true)
    },
    [data.date, disabledDates]
  )

  /**
   * Sets range dates
   */
  const handleDateClick = useCallback(
    (day: number, type: 'previous' | 'current' | 'next') => {
      const dates = {
        previous: getPreviousMonth(data.date),
        current: data.date,
        next: getNextMonth(data.date),
      }
      const nextDate = dates[type].date(day)

      if (useSingleValue) {
        return updateRange({ start: nextDate, end: nextDate })
      }

      const disabledDate =
        resolveDateTooEarly(day, type) ||
        resolveDateTooLate(day, type) ||
        resolveDisabledDates(day, type)

      if (disabledDate) return

      // will start a new range on the first click after the previous range is selected
      if (range.start && range.end) {
        updateRange({ start: nextDate, end: null })
      }
      if (range.start && !range.end) {
        updateRange({ start: range.start, end: nextDate })
      }
      if (!range.start && range.end) {
        updateRange({ start: nextDate, end: range.end })
      }
      // this will allow the user to begin selecting range
      if (!range.start && !range.end) {
        updateRange({ start: nextDate, end: null })
      }

      updateHoveredDate(null)
    },
    [
      data.date,
      range.end,
      range.start,
      resolveDateTooEarly,
      resolveDateTooLate,
      resolveDisabledDates,
      updateHoveredDate,
      updateRange,
      useSingleValue,
    ]
  )

  /**
   * Resolves day hover - sets range
   */
  const resolveHoverDate = useCallback(
    (day: number, type: 'next' | 'current' | 'previous') => {
      const selectedData = {
        previous: getPreviousMonth(data.date.date(day)),
        current: data.date.date(day),
        next: getNextMonth(data.date.date(day)),
      }

      const nextDate = selectedData[type]

      if (range.start && !range.end) {
        if (dayjs(nextDate).isBefore(range.start)) {
          updateRange({ start: null, end: range.start })
        }
        updateHoveredDate(nextDate)
      }

      if (!range.start && range.end) {
        if (dayjs(nextDate).isAfter(range.end)) {
          updateRange({ start: range.end, end: null })
        }
        updateHoveredDate(nextDate)
      }
    },
    [data.date, range.end, range.start, updateHoveredDate, updateRange]
  )

  /**
   * Resolves hover class on calendar days
   */
  const resolveHoverClass = useCallback(
    (day: number): ThemeBoolReturnType => {
      const selectedDate = data.date.date(day)

      if (range.start && range.end) {
        if (
          dayjs(selectedDate).isBetween(range.start, range.end, 'date', '()')
        ) {
          return 'true'
        }
      }

      if (
        range.start &&
        dayjs(selectedDate).isBetween(range.start, hoveredDate, 'date', '()')
      ) {
        return 'true'
      }

      if (
        range.end &&
        dayjs(selectedDate).isBetween(hoveredDate, range.end, 'day', '()')
      ) {
        return 'true'
      }

      return 'false'
    },
    [data.date, hoveredDate, range.end, range.start]
  )

  /**
   * Resolves range.start class
   */
  const resolveSelectedStartDateClass = useCallback(
    (day: number): ThemeBoolReturnType => {
      const sameYear = data.date.year() === range.start?.year()
      const sameMonth = data.date.month() === range.start?.month()
      const sameDay = range.start?.date() === day

      return sameYear && sameMonth && sameDay ? 'true' : 'false'
    },
    [data.date, range.start]
  )

  /**
   * Resolves range.end class
   */
  const resolveSelectedEndDateClass = useCallback(
    (day: number): ThemeBoolReturnType => {
      const sameYear = data.date.year() === range.end?.year()
      const sameMonth = data.date.month() === range.end?.month()
      const sameDay = range.end?.date() === day

      return sameYear && sameMonth && sameDay ? 'true' : 'false'
    },
    [data.date, range.end]
  )

  /**
   * Resolves current date class
   */
  const resolveCurrentDateClass = useCallback(
    (day: number): ThemeBoolReturnType => {
      return dayjs().date(day).isSame(data.date, 'date') ? 'true' : 'false'
    },
    [data.date]
  )

  /**
   * Resolves current weekday class
   */
  const resolveCurrentWeekdayClass = useCallback(
    (weekDay: number): ThemeBoolReturnType => {
      return dayjs().day(weekDay).isSame(data.date, 'day') ? 'true' : 'false'
    },
    [data.date]
  )

  /**
   * Resolves hovered day class if there is no range.end
   */
  const resolveHoveredEndDayClass = useCallback(
    (day: number): ThemeBoolReturnType => {
      return range.start && hoveredDate?.isSame(data.date.date(day))
        ? 'true'
        : 'false'
    },
    [data.date, hoveredDate, range.start]
  )

  /**
   * Resolves hovered day class if there is no range.start
   */
  const resolveHoveredStartDateClass = useCallback(
    (day: number): ThemeBoolReturnType => {
      return !range.start && hoveredDate?.isSame(data.date.date(day))
        ? 'true'
        : 'false'
    },
    [data.date, hoveredDate, range.start]
  )

  return (
    <div className={classNames(theme.base)}>
      <div className={classNames(theme.inner.base)}>
        <Selector
          date={data.date}
          onNextClick={selectorOpen ? handleNextYearsClick : onNextClick}
          onPreviousClick={
            selectorOpen ? handlePreviousYearsClick : onPreviousClick
          }
          onSelectorClick={onSelectorClick}
          selectorOpen={selectorOpen}
        />

        {!selectorOpen && (
          <>
            <div className={classNames(theme.inner.week.base)}>
              {getFormattedWeekDays(i18n).map(
                (weekDay: string, index: number) => (
                  <div
                    className={classNames(
                      theme.inner.week.item,
                      theme.inner.week.current[
                        resolveCurrentWeekdayClass(index)
                      ]
                    )}
                    key={`${weekDay}-${index}`}
                  >
                    <span>{weekDay.toUpperCase()}</span>
                  </div>
                )
              )}
            </div>
            <div className={classNames(theme.inner.calendar.base)}>
              {data.days.previous.map((day: number, index: number) => {
                return (
                  <button
                    className={classNames(
                      theme.inner.previous.base,
                      theme.inner.previous.disabled[
                        resolveDateTooEarly(day, 'previous') ? 'true' : 'false'
                      ],
                      theme.inner.previous.disabled[
                        resolveDateTooLate(day, 'previous') ? 'true' : 'false'
                      ],
                      theme.inner.previous.disabled[
                        resolveDisabledDates(day, 'previous') ? 'true' : 'false'
                      ]
                    )}
                    key={`${day}-${index}`}
                    onClick={() => handleDateClick(day, 'previous')}
                    onMouseOver={() => resolveHoverDate(day, 'previous')}
                  >
                    <span>{day}</span>
                  </button>
                )
              })}
              {data.days.current.map((day: number, index: number) => {
                return (
                  <button
                    className={classNames(
                      theme.inner.current.base,
                      theme.inner.current.hover[resolveHoverClass(day)],
                      theme.inner.current.current[resolveCurrentDateClass(day)],
                      theme.inner.current.start.selected[
                        resolveSelectedStartDateClass(day)
                      ],
                      theme.inner.current.end.selected[
                        resolveSelectedEndDateClass(day)
                      ],
                      theme.inner.current.disabled[
                        resolveDateTooEarly(day, 'current') ? 'true' : 'false'
                      ],
                      theme.inner.current.disabled[
                        resolveDateTooLate(day, 'current') ? 'true' : 'false'
                      ],
                      theme.inner.current.disabled[
                        resolveDisabledDates(day, 'current') ? 'true' : 'false'
                      ],
                      theme.inner.current.end.hovered[
                        resolveHoveredEndDayClass(day)
                      ],
                      theme.inner.current.start.hovered[
                        resolveHoveredStartDateClass(day)
                      ]
                    )}
                    key={`${day}-${index}`}
                    onClick={() => handleDateClick(day, 'current')}
                    onMouseOver={() => resolveHoverDate(day, 'current')}
                  >
                    <span>{day}</span>
                  </button>
                )
              })}
              {data.days.next.map((day: number, index: number) => {
                return (
                  <button
                    className={classNames(
                      theme.inner.next.base,
                      theme.inner.next.disabled[
                        resolveDateTooEarly(day, 'next') ? 'true' : 'false'
                      ],
                      theme.inner.next.disabled[
                        resolveDateTooLate(day, 'next') ? 'true' : 'false'
                      ],
                      theme.inner.next.disabled[
                        resolveDisabledDates(day, 'next') ? 'true' : 'false'
                      ]
                    )}
                    key={`${day}-${index}`}
                    onClick={() => handleDateClick(day, 'next')}
                    onMouseOver={() => resolveHoverDate(day, 'next')}
                  >
                    <span>{day}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {selectorOpen && (
          <div className={classNames(theme.inner.selector.base)}>
            <div className={classNames(theme.inner.selector.items.base)}>
              {getFormattedMonths(i18n).map((month, index: number) => (
                <button
                  className={classNames(
                    theme.inner.selector.items.item,
                    theme.inner.current.current[
                      dayjs().month() === index ? 'true' : 'false'
                    ],
                    theme.inner.selector.current[
                      data.date.month() === index ? 'true' : 'false'
                    ]
                  )}
                  key={month}
                  onClick={() => onSelectMonth(index)}
                >
                  <span>{month}</span>
                </button>
              ))}
            </div>
            <div className={classNames(theme.inner.selector.separator)} />
            <div className={classNames(theme.inner.selector.items.base)}>
              {generateArrayOfYears(yearInterval, yearInterval + 11).map(
                (year: string) => {
                  return (
                    <button
                      onClick={() => onSelectYear(Number(year))}
                      key={year}
                      className={classNames(
                        theme.inner.selector.items.item,
                        theme.inner.current.current[
                          dayjs().year() === Number(year) ? 'true' : 'false'
                        ],
                        theme.inner.current.current[
                          data.date.year() === Number(year) ? 'true' : 'false'
                        ]
                      )}
                    >
                      <span>{year}</span>
                    </button>
                  )
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
