import { SnackbarProvider, useSnackbar } from 'notistack'
import { PropsWithChildren, ReactElement, useCallback, useEffect, useMemo } from 'react'

import { bus, BusEvents } from '@/helpers'

import DefaultToast from './DefaultToast'

const STATUS_MESSAGE_AUTO_HIDE_DURATION = 7 * 1000

export type ToastPayload = {
  messageType?: BusEvents

  title?: string
  message?: string | ReactElement
}

declare module 'notistack' {
  interface VariantOverrides {
    defaultToast: ToastPayload
  }
}

function ToastsManagerController({ children }: PropsWithChildren) {
  const { enqueueSnackbar } = useSnackbar()

  const defaultTitles = useMemo(
    () => ({
      [BusEvents.success]: 'Success',
      [BusEvents.error]: 'Error',
      [BusEvents.warning]: 'Warning',
      [BusEvents.info]: 'Info',
    }),
    [],
  )

  const showToast = useCallback(
    (messageType = BusEvents.info, payload: ToastPayload) => {
      const title = payload?.title || defaultTitles[messageType]
      const message = payload?.message

      enqueueSnackbar(message, {
        variant: 'defaultToast',

        messageType,
        title,
        message,
      })
    },
    [defaultTitles, enqueueSnackbar],
  )

  const showSuccessToast = useCallback(
    (payload?: unknown) => showToast(BusEvents.success, payload as ToastPayload),
    [showToast],
  )

  const showWarningToast = useCallback(
    (payload?: unknown) => showToast(BusEvents.warning, payload as ToastPayload),
    [showToast],
  )
  const showErrorToast = useCallback(
    (payload?: unknown) => showToast(BusEvents.error, payload as ToastPayload),
    [showToast],
  )
  const showInfoToast = useCallback(
    (payload?: unknown) => showToast(BusEvents.info, payload as ToastPayload),
    [showToast],
  )

  useEffect(() => {
    bus.on(BusEvents.success, showSuccessToast)
    bus.on(BusEvents.warning, showWarningToast)
    bus.on(BusEvents.error, showErrorToast)
    bus.on(BusEvents.info, showInfoToast)

    return () => {
      bus.off(BusEvents.success, showSuccessToast)
      bus.off(BusEvents.warning, showWarningToast)
      bus.off(BusEvents.error, showErrorToast)
      bus.off(BusEvents.info, showInfoToast)
    }
  }, [showErrorToast, showInfoToast, showSuccessToast, showWarningToast])

  return children
}

export default function ToastsManager({ children }: { children: ReactElement }) {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={STATUS_MESSAGE_AUTO_HIDE_DURATION}
      Components={{ defaultToast: DefaultToast }}
      maxSnack={10}
    >
      <ToastsManagerController>{children}</ToastsManagerController>
    </SnackbarProvider>
  )
}
