import { Alert, AlertColor, AlertTitle, Typography, useTheme } from '@mui/material'
import { CustomContentProps, SnackbarContent, useSnackbar } from 'notistack'
import { forwardRef, ReactNode, useMemo } from 'react'

import { BusEvents } from '@/helpers'

interface Props extends CustomContentProps {
  messageType: BusEvents
  title: string
  message: string | ReactNode
}

const DefaultToast = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const { message, title, id } = props
  const { spacing, palette } = useTheme()

  const { closeSnackbar } = useSnackbar()

  const severityMap = useMemo<Record<BusEvents, AlertColor>>(
    () => ({
      [BusEvents.success]: 'success',
      [BusEvents.error]: 'error',
      [BusEvents.warning]: 'warning',
      [BusEvents.info]: 'info',
    }),
    [],
  )

  return (
    <SnackbarContent ref={ref} role='alert'>
      <Alert
        severity={severityMap[props.messageType]}
        sx={{ maxWidth: spacing(100) }}
        onClose={() => closeSnackbar(id)}
      >
        <AlertTitle marginBottom={0}>{title}</AlertTitle>
        {typeof message === 'string' ? (
          <Typography variant='body4' color={palette.text.secondary}>
            {message}
          </Typography>
        ) : (
          message
        )}
      </Alert>
    </SnackbarContent>
  )
})

DefaultToast.displayName = 'DefaultToast'

export default DefaultToast
