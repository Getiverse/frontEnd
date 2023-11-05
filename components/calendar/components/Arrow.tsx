import type { FC } from 'react'
import type { ArrowProps } from '../types'
import classNames from 'classnames'

export const Arrow: FC<ArrowProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        className,
        'absolute top-[74px] left-2 h-6 w-6 rotate-45 border-t-2 border-l-2 border-gray-300 bg-white z-20 bg-white rounded-tl-[3px] dark:bg-slate-800 dark:border-slate-700'
      )}
    ></div>
  )
}
