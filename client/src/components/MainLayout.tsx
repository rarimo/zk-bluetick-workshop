import { Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <Stack spacing={6} px={4} my={8} maxWidth={640} width='100%' mx='auto'>
      {children}
    </Stack>
  )
}
