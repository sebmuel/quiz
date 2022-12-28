import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { rootCertificates } from 'tls'
import SocketContextComponent from '../src/contexts/Socket/Component'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContextComponent>
      <Component {...pageProps}/>
    </SocketContextComponent>
  )
}

