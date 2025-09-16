import '../styles/globals.css'
import Layout from '../components/Layout'
import { AuthProvider } from '../context/AuthContext'
import { Web3Provider } from '../context/Web3Context'
import { ChatProvider } from '../context/ChatContext'

export default function App({ Component, pageProps }) {
  return (
    <Web3Provider>
      <AuthProvider>
        <ChatProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChatProvider>
      </AuthProvider>
    </Web3Provider>
  )
}