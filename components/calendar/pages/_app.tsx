import '../../styles/globals.css'
import { AppProps } from 'next/app'
import { ThemeContext } from '../contexts/ThemeContext'
import theme from '../theme/default'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeContext.Provider value={{ theme }}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  )
}

export default MyApp
