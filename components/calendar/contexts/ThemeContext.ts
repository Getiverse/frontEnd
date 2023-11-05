import type { ThemeContextProps } from '../types'
import { createContext, useContext } from 'react'
import defaultTheme from '../theme/default'

export const ThemeContext = createContext<ThemeContextProps>({
  theme: defaultTheme,
})

export const useThemeContext = (): ThemeContextProps => {
  const context = useContext(ThemeContext)
  return context
}

ThemeContext.displayName = 'DatetimePickerThemeContext'
