import type { Time, TimepickerProps } from '../types'
import { FC, useEffect } from 'react'
import { ClockIcon } from '../icons/Clock'
import { useCallback, useMemo, useRef, useState } from 'react'
import { generateHoursMinutesAndSeconds } from '../utils/dateUtils'
import { Arrow } from './Arrow'
import classNames from 'classnames'
import dayjs from 'dayjs'
import useOutsideClick from '../../../hooks/useOutsideClick'

// TODO: scroll time item into view when pressing "Now" button
export const Timepicker: FC<TimepickerProps> = ({
    onChange,
    hoursLabel = 'Hours',
    minutesLabel = 'Minutes',
    placeholder = '00:00:00',
    label = 'Time',
    nowButtonLabel = '',
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [selectedTime, setSelectedTime] = useState<Time>({
        hour: '00',
        minute: '00',
    })

    const [value, setValue] = useState<string>('')

    const [open, setOpen] = useState<boolean>(false)

    const { hours, minutes } = generateHoursMinutesAndSeconds()

    useOutsideClick(dropdownRef, () => {
        if (open) setOpen(false)

        if (value.includes(':')) return
        const [hour, minute] = value.replace(/..\B/g, '$&:').split(':')
        setSelectedTime({
            hour: hour ?? '',
            minute: minute ?? '',
        })
    })

    const handleManualInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (!value.match(/^$|[0-9, :]/g)) return
        setValue(value)
    }

    const handleSelectTime = useCallback(
        ({
            hour,
            minute,
        }: {
            hour?: string
            minute?: string
        }) => {
            setSelectedTime((prev) => ({
                hour: hour ?? prev.hour,
                minute: minute ?? prev.minute
            }))

            onChange(selectedTime)
        },
        [onChange, value]
    )

    const handleNowClick = useCallback(() => {
        const nextTime: Time = {
            hour: dayjs().hour().toString(),
            minute: dayjs().minute().toString(),
        }

        setSelectedTime(nextTime)
        onChange(nextTime)
    }, [onChange, value])

    useEffect(() => {
        setValue(
            `${selectedTime.hour}:${selectedTime.minute}`
        )
        console.log(value)
    }, [selectedTime.hour, selectedTime.minute])

    const handleInputClick = () => {
        setOpen((p) => !p)
    }

    const list = 'flex flex-col flex-1 gap-2 overflow-y-scroll scrollbar-thin'
    const item =
        'text-center px-2 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-pointer rounded-md transition-hover duration-200'

    const content = useMemo(
        () => (
            <div className="flex flex-col flex-1 w-full h-full gap-4">
                <div className="flex flex-1 gap-4 h-full w-full justify-around max-h-60">
                    <div className="flex flex-col items-center gap-2">
                        <span>{hoursLabel}</span>
                        <ul className={list}>
                            {hours.map((hour: string) => {
                                const selected = hour === selectedTime.hour

                                return (
                                    <li
                                        key={hour}
                                        className={classNames(
                                            item,
                                            selected ? 'bg-blue-400 dark:bg-blue-600' : ''
                                        )}
                                        onClick={() => handleSelectTime({ hour })}
                                    >
                                        {hour}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span>{minutesLabel}</span>
                        <ul className={list}>
                            {minutes.map((minute: string) => {
                                const selected = minute === selectedTime.minute
                                return (
                                    <li
                                        key={minute}
                                        className={classNames(
                                            item,
                                            selected ? 'bg-blue-400 dark:bg-blue-600' : ''
                                        )}
                                        onClick={() => handleSelectTime({ minute })}
                                    >
                                        {minute}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        ),
        [
            handleNowClick,
            handleSelectTime,
            hours,
            hoursLabel,
            minutes,
            minutesLabel,
            nowButtonLabel,
            selectedTime.hour,
            selectedTime.minute
        ]
    )

    return (
        <div className="w-full h-full relative flex flex-col dark:text-white/70 border-t border-gray-300 dark:border-gray-600 pt-3">
            <div className="flex items-center w-full px-1 justify-between">
                <span className="font-bold">{label}</span>
                <div className="relative">
                    <input
                        onClick={handleInputClick}
                        onChange={handleManualInput}
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        maxLength={6}
                        className={classNames(
                            'opacity-80 pl-2 py-1 w-16 rounded-md border-2 border-gray-300 outline outline-transparent focus:border-gray-400 dark:bg-slate-700 dark:border-slate-600 dark:text-white/70'
                        )}
                    />
                </div>
            </div>
            <Arrow className={classNames(open ? 'hidden md:block' : 'hidden')} />
            <div
                ref={dropdownRef}
                className={classNames(
                    open ? 'block' : 'hidden',
                    'shadow-2xl brightness-150 drop-shadow-2xl  absolute h-40 bottom-12 md:absolute z-10 md:top-[85px] md:left-[-12px] bg-white border border-gray-300 md:h-fit w-full rounded-md p-4 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 border-2'
                )}
            >
                {content}
            </div>
        </div>
    )
}
