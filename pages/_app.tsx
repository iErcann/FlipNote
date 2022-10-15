import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Container } from '@chakra-ui/react'
import SimpleSidebar from '../components/Sidebar'
import theme from "../components/theme"
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
