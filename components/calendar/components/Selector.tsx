import type { FC } from 'react'
import classNames from 'classnames'
import { useDatetimePickerContext } from '../contexts/DatetimePickerContext'
import { useThemeContext } from '../contexts/ThemeContext'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from '../icons'
import { getFormattedMonthAndYear } from '../utils/dateUtils'
import { loadI18n } from '../utils/i18nUtils'
import { SelectorProps } from '../types'
import { deepMerge } from '../utils/deepMerge'

export const Selector: FC<SelectorProps> = ({
  onNextClick,
  onPreviousClick,
  selectorOpen,
  onSelectorClick,
  date,
}) => {
  const { i18n, customTheme } = useDatetimePickerContext()

    loadI18n(i18n)
    const theme = deepMerge(
    useThemeContext().theme.monthSelector,
    customTheme?.monthSelector ?? {}
  )

  return (
    <div className={classNames(theme.base)} id="month-selector">
      <div className={classNames(theme.selector.base)}>
        <button
          className={classNames(theme.selector.month)}
          onClick={onSelectorClick}
        >
          <span>{getFormattedMonthAndYear(date, i18n)}</span>
        </button>
        <div className="flex flex-1 items-center gap-2 justify-end">
          <button
            className={classNames(theme.selector.previous)}
            onClick={onPreviousClick}
          >
            {selectorOpen ? <DoubleChevronLeftIcon /> : <ChevronLeftIcon />}
          </button>
          <button
            className={classNames(theme.selector.next)}
            onClick={onNextClick}
          >
            {selectorOpen ? <DoubleChevronRightIcon /> : <ChevronRightIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}
