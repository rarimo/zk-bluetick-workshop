import { CssBaseline, Divider, ThemeProvider } from '@mui/material'
import { useAppKit, useAppKitState } from '@reown/appkit/react'
import { memo, useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { createTheme } from '@/theme'

import MainLayout from './components/MainLayout'
import PostForm from './components/PostForm'
import PostsList from './components/PostsList'
import ToastsManager from './components/toasts-manager'
import { useWeb3Context } from './web3-context'

const App = () => {
  const { isInitialized: isWeb3Initialized, isCorrectNetwork } = useWeb3Context()
  const { close } = useAppKit()
  const { open: isOpen, loading: isLoading } = useAppKitState()

  const theme = useMemo(() => createTheme(), [])

  useEffect(() => {
    const handleCloseModal = async () => {
      if (isOpen && !isCorrectNetwork && !isLoading) {
        await close()
      }
    }
    handleCloseModal()
  }, [isOpen, isCorrectNetwork, close, isLoading])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isWeb3Initialized && (
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <ToastsManager>
            <MainLayout>
              <PostForm />
              <Divider />
              <PostsList />
            </MainLayout>
          </ToastsManager>
        </ErrorBoundary>
      )}
    </ThemeProvider>
  )
}

export default memo(App)
