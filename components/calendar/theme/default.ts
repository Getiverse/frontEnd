import { DatetimePickerTheme } from '../types'

const theme: DatetimePickerTheme = {
  base: 'bg-white w-full h-full md:h-fit md:border-2 border-gray-300 shadow-lg md:rounded-md md:border-b-2 relative dark:bg-slate-800 dark:border-slate-700',
  disabled: {
    true: 'border-gray-100 cursor-not-allowed',
    false: 'bg-white',
  },
  useDouble: {
    true: 'w-full ',
    false: 'w-fit max-md:h-fit',
  },
  inner: {
    base: 'flex flex-1 max-md:flex-col h-full',
    disabled:
      'absolute w-full h-full z-50 bg-gray-50 opacity-70 cursor-not-allowed',
  },
  monthSelector: {
    base: 'w-full flex flex-initial items-center justify-between py-4 dark:text-white/70',
    selector: {
      base: 'w-full flex flex-1 items-center justify-between px-4 dark:text-white/70',
      previous:
        'flex items-center justify-center p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-hover duration-200 mr-2',
      month:
        'flex items-center w-fit justify-start px-2 py-1.5 hover:bg-gray-200  dark:hover:bg-slate-700 rounded-md transition-hover duration-200',
      year: 'flex items-center flex-1 justify-center px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-hover duration-200',
      next: 'flex items-center justify-center p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-hover duration-200 ml-2',
    },
  },
  calendar: {
    base: 'flex flex-1 max-md:h-full w-screen md:w-full dark:text-white/70',
    inner: {
      base: 'flex flex-1 w-full flex-col',
      week: {
        base: 'grid grid-cols-7 gap-y-1  w-full tracking-wide pb-1 text-sm p-4',
        item: 'flex items-center justify-center w-full',
        current: {
          true: 'text-blue-600',
          false: 'text-gray-600 dark:text-slate-500',
        },
      },
      calendar: {
        base: 'grid grid-cols-7 gap-y-1 w-full pt-2 p-4 max-md:h-full',
      },

      previous: {
        base: 'flex items-center justify-center h-10 w-10 w-full text-gray-400 dark:text-slate-500/80',
        disabled: {
          true: 'line-through cursor-not-allowed',
          false: '',
        },
      },
      current: {
        base: 'flex items-center justify-center h-10 w-full',
        disabled: {
          true: 'line-through text-gray-400 cursor-not-allowed',
          false: 'dark:text-white/80',
        },
        current: {
          true: '!text-blue-600',
          false: '',
        },
        start: {
          selected: {
            true: 'bg-blue-400 !rounded-l-lg dark:bg-blue-600/80',
            false: '',
          },
          hovered: {
            true: 'bg-blue-400 rounded-l-lg dark:bg-blue-600/80',
            false: '',
          },
        },
        end: {
          selected: {
            true: 'bg-blue-400 !rounded-r-lg dark:bg-blue-600/80',
            false: '',
          },
          hovered: {
            true: 'bg-blue-400 rounded-r-lg dark:bg-blue-600/80',
            false: '',
          },
        },
        hover: {
          true: 'bg-blue-200 dark:bg-slate-700',
          false: '',
        },
      },
      next: {
        base: 'flex items-center justify-center h-10 w-10 w-full text-gray-400 dark:text-slate-500/80',
        disabled: {
          true: 'line-through cursor-not-allowed',
          false: '',
        },
      },
      selector: {
        base: 'flex flex-1 items-center justify-between gap-8 px-4 py-2',
        separator: 'h-5/6 w-[3px] bg-gray-300 my-20 dark:bg-slate-500',
        current: {
          true: 'text-blue-600',
          false: '',
        },
        items: {
          base: 'grid grid-cols-2 gap-y-1 tracking-wide w-full',
          item: 'flex flex-1 items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-hover duration-200 p-3',
        },
      },
    },
  },
}

export default theme
