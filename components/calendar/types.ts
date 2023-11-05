import type { Dayjs } from 'dayjs'
import type { ComponentProps } from 'react'

// Generics
export type ThemeBoolReturnType = 'true' | 'false'
export interface ThemeBool {
  true: string
  false: string
}
export interface InternalDateRange {
  start: Dayjs | null
  end: Dayjs | null
}
export interface PublicDateRange {
  start: Date | Dayjs | null
  end: Date | Dayjs | null
}

export type Time = {
  hour: string
  minute: string
}
export type CalendarData = {
  date: Dayjs
  days: {
    previous: number[]
    current: number[]
    next: number[]
  }
}

export type DisabledDate = Dayjs | null

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

// Theme

export interface PublicDatePimepickerTheme {
  base?: string
  monthSelector?: {
    base?: string
    selector?: {
      base?: string
      previous?: string
      month?: string
      year?: string
      next?: string
    }
  }
  calendar?: {
    base?: string
    inner?: {
      base?: string
      week?: {
        base?: string
        item?: string
        current?: ThemeBool
      }
      calendar?: {
        base?: string
      }
      previous: {
        base?: string
        disabled?: ThemeBool
      }
      current?: {
        base?: string
        disabled?: ThemeBool
        current?: ThemeBool
        start?: {
          selected?: ThemeBool
          hovered?: ThemeBool
        }
        end?: {
          selected?: ThemeBool
          hovered?: ThemeBool
        }
        hover?: ThemeBool
      }
      next?: {
        base?: string
        disabled?: ThemeBool
      }
      selector?: {
        base?: string
        separator?: string
        current?: ThemeBool
        items?: {
          base?: string
          item?: string
        }
      }
    }
  }
}
export interface DatetimePickerTheme {
  base: string
  disabled: ThemeBool
  useDouble: {
    true: string
    false: string
  }
  inner: {
    base: string
    disabled: string
  }
  monthSelector: {
    base: string
    selector: {
      base: string
      previous: string
      month: string
      year: string
      next: string
    }
  }
  calendar: {
    base: string
    inner: {
      base: string
      week: {
        base: string
        item: string
        current: ThemeBool
      }
      calendar: {
        base: string
      }
      previous: {
        base: string
        disabled: ThemeBool
      }
      current: {
        base: string
        disabled: ThemeBool
        current: ThemeBool
        start: {
          selected: ThemeBool
          hovered: ThemeBool
        }
        end: {
          selected: ThemeBool
          hovered: ThemeBool
        }
        hover: ThemeBool
      }
      next: {
        base: string
        disabled: ThemeBool
      }
      selector: {
        base: string
        separator: string
        current: ThemeBool
        items: {
          base: string
          item: string
        }
      }
    }
  }
}

// Components
export interface DatetimePickerConfig {
  maxDate?: Date | Dayjs | null
  minDate?: Date | Dayjs | null
  disabledDates?: Date[] | Dayjs[] | null
  useDoubleCalendars?: boolean
  useSingleValue?: boolean
  startFrom?: Date | Dayjs | null
  i18n?: string
  useTimepicker?: boolean
  startTimeLabel?: string
  endTimeLabel?: string
  timepickerNowButtonLabel?: string
  disabled?: boolean
}

export interface DatetimePickerProps {
  onChange: (range: PublicDateRange) => void
  theme?: PublicDatePimepickerTheme
  config?: DatetimePickerConfig
}

export type ArrowProps = ComponentProps<'div'>

export interface IconProps {
  className?: string
}

export interface SelectorProps {
  onNextClick: () => void
  onPreviousClick: () => void
  onSelectorClick: () => void
  selectorOpen: boolean
  date: CalendarData['date']
}

export interface CalendarProps {
  onNextClick: () => void
  onPreviousClick: () => void
  onSelectorClick: () => void
  onSelectMonth: (month: number) => void
  onSelectYear: (year: number) => void
  data: CalendarData
  selectorOpen: boolean
}

export interface TimepickerProps {
  onChange: (selectedTime: Time) => void
  value?: string
  hoursLabel?: string
  minutesLabel?: string
  secondsLabel?: string
  placeholder?: string
  label?: string
  nowButtonLabel?: string
}

// Contexts
export interface ThemeContextProps {
  theme: DatetimePickerTheme
}

export interface DatetimePickerContext {
  customTheme?: PublicDatePimepickerTheme | null
  maxDate?: Dayjs | null
  minDate?: Dayjs | null
  disabledDates?: DisabledDate[] | null
  i18n: string
  disabled: boolean
  useDouble: boolean
  useTimepicker: boolean
  useSingleValue: boolean
  leftDate: Dayjs
  rightDate: Dayjs
  leftSelectorOpen: boolean
  rightSelectorOpen: boolean
  range: InternalDateRange
  updateRange: (range: InternalDateRange) => void
  hoveredDate: Dayjs | null
  updateHoveredDate: (date: Dayjs | null) => void
}
