import type { FC } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useMemo } from 'react'
import { DatetimePickerContext } from '../contexts/DatetimePickerContext'
import { useThemeContext } from '../contexts/ThemeContext'
import {
    getDaysInMonth,
    getFirstDaysOfMonth,
    getLastDaysOfMonth,
    getNextMonth,
    getPreviousMonth,
} from '../utils/dateUtils'
import { Calendar } from './Calendar'
import {
    CalendarData,
    InternalDateRange,
    DatetimePickerProps,
    Time,
} from '../types'
import classNames from 'classnames'
import { Timepicker } from './Timepicker'
import { deepMerge } from '../utils/deepMerge'

const DatetimePicker: FC<DatetimePickerProps> = ({
    onChange,
    theme: customTheme,
    config: {
        disabled = false,
        i18n = 'en',
        useDoubleCalendars = true,
        useTimepicker = true,
        useSingleValue = false,
        startFrom = null,
        maxDate = null,
        minDate = null,
        disabledDates = null,
        startTimeLabel = 'Time',
        endTimeLabel = 'To',
        timepickerNowButtonLabel = 'Now',
    } = {},
}) => {
    const theme = deepMerge(useThemeContext().theme, customTheme ?? {})

    const [leftDate, setLeftDate] = useState<Dayjs>(
        dayjs(startFrom).isValid() ? dayjs(startFrom) : dayjs()
    )
    const [rightDate, setRightDate] = useState<Dayjs>(getNextMonth(leftDate))

    const [leftSelectorOpen, setLeftSelectorOpen] = useState<boolean>(false)
    const [rightSelectorOpen, setRightSelectorOpen] = useState<boolean>(false)

    const [range, setRange] = useState<InternalDateRange>({
        start: null,
        end: null,
    })
    const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null)

    useEffect(() => {
        onChange(range)
    }, [onChange, range])

    const context = useMemo(
        () => ({
            customTheme: customTheme ?? null,
            i18n,
            useDouble: useDoubleCalendars,
            useTimepicker,
            useSingleValue,
            startFrom,
            maxDate: maxDate && dayjs(maxDate).isValid() ? dayjs(maxDate) : null,
            minDate: minDate && dayjs(minDate).isValid() ? dayjs(minDate) : null,
            disabledDates:
                disabledDates &&
                disabledDates.map((disabledDate) => {
                    if (dayjs(disabledDate).isValid()) return dayjs(disabledDate)
                    return null
                }),
            onChange,

            disabled,
            leftDate,
            rightDate,
            leftSelectorOpen,
            rightSelectorOpen,
            range,
            updateRange: (range: InternalDateRange) => setRange(range),
            hoveredDate,
            updateHoveredDate: (date: Dayjs | null) => setHoveredDate(date),
        }),
        [
            customTheme,
            disabled,
            disabledDates,
            hoveredDate,
            i18n,
            leftDate,
            leftSelectorOpen,
            maxDate,
            minDate,
            onChange,
            range,
            rightDate,
            rightSelectorOpen,
            startFrom,
            useDoubleCalendars,
            useSingleValue,
            useTimepicker,
        ]
    )

    const data: CalendarData[] = useMemo(
        () => [
            {
                date: leftDate,
                days: {
                    previous: getLastDaysOfMonth(getPreviousMonth(leftDate), 3),
                    current: getDaysInMonth(leftDate),
                    next: getFirstDaysOfMonth(
                        getNextMonth(leftDate),
                        39 -
                        (getLastDaysOfMonth(getPreviousMonth(leftDate)).length +
                            getDaysInMonth(leftDate).length)
                    ),
                },
            },
            {
                date: rightDate,
                days: {
                    previous: getLastDaysOfMonth(getPreviousMonth(rightDate), 3),
                    current: getDaysInMonth(rightDate),
                    next: getFirstDaysOfMonth(
                        getNextMonth(leftDate),
                        39 -
                        (getLastDaysOfMonth(getPreviousMonth(rightDate)).length +
                            getDaysInMonth(rightDate).length)
                    ),
                },
            },
        ],
        [leftDate, rightDate]
    )

    const handleSelectorClick = useCallback((range: 'first' | 'second') => {
        if (range === 'first') {
            setLeftSelectorOpen((p) => !p)
        }
    }, [])

    const handleSelectMonth = useCallback(
        (month: number, range: 'first' | 'second') => {
            if (range === 'first') {
                const nextDate = dayjs(leftDate).month(month)
                setLeftDate(nextDate)
            }
        },
        [leftDate]
    )

    const handleSelectYear = useCallback(
        (year: number, range: 'first' | 'second') => {
            if (range === 'first') {
                const nextDate = dayjs(leftDate).year(year)
                setLeftDate(nextDate)
            }
        },
        [leftDate]
    )

    const handleNextClick = useCallback(
        (range: 'first' | 'second') => {
            if (range === 'first') {
                setLeftDate(getNextMonth(leftDate))
            }
        },
        [rightDate]
    )

    const handlePreviousClick = useCallback(
        (range: 'first' | 'second') => {
            if (range === 'first') {
                setLeftDate(getPreviousMonth(leftDate))
            }
        },
        [leftDate]
    )

    const handleTimepickerChange = useCallback(
        (time: Time, type: 'first' | 'second') => {
            if (type === 'first') {
                const nextRange: InternalDateRange = {
                    start: dayjs(range.start)
                        .hour(Number(time.hour))
                        .minute(Number(time.minute)),
                    end: range.end,
                }
                setRange(nextRange)
            }
        },
        [range.start, range.end]
    )

    return (
        <DatetimePickerContext.Provider value={context}>
            <div
                id="base"
                className={classNames(
                    theme.base,
                    theme.disabled[disabled ? 'true' : 'false'],
                    theme.useDouble[useDoubleCalendars ? 'true' : 'false']
                )}
            >
                {disabled && <div className={theme.inner.disabled} />}
                <div className={classNames(theme.inner.base)}>
                    <Calendar
                        data={data[0]}
                        onSelectMonth={(month: number) => handleSelectMonth(month, 'first')}
                        onSelectYear={(year: number) => handleSelectYear(year, 'first')}
                        onSelectorClick={() => handleSelectorClick('first')}
                        onPreviousClick={() => handlePreviousClick('first')}
                        onNextClick={() => handleNextClick('first')}
                        selectorOpen={leftSelectorOpen}
                    />

                    {useDoubleCalendars && (
                        <Calendar
                            data={data[1]}
                            onSelectMonth={(month: number) =>
                                handleSelectMonth(month, 'second')
                            }
                            onSelectYear={(year: number) => handleSelectYear(year, 'second')}
                            onSelectorClick={() => handleSelectorClick('second')}
                            onPreviousClick={() => handlePreviousClick('second')}
                            onNextClick={() => handleNextClick('second')}
                            selectorOpen={rightSelectorOpen}
                        />
                    )}
                </div>
                {useTimepicker && (
                    <div
                        className={classNames(
                            'flex items-center w-full px-4 pb-4 gap-4 max-md:flex-col'
                        )}
                    >
                        <Timepicker
                            onChange={(value: Time) => handleTimepickerChange(value, 'first')}
                            label={startTimeLabel}
                            nowButtonLabel={timepickerNowButtonLabel}
                        />
                        {!useSingleValue && (
                            <Timepicker
                                onChange={(value: Time) =>
                                    handleTimepickerChange(value, 'second')
                                }
                                label={endTimeLabel}
                                nowButtonLabel={timepickerNowButtonLabel}
                            />
                        )}
                    </div>
                )}
            </div>
        </DatetimePickerContext.Provider>
    )
}

export default DatetimePicker
