import { Button, Stack, TextField } from '@mui/material'
import { useAppKit, useAppKitEvents } from '@reown/appkit/react'
import { useEffect, useRef } from 'react'

import { useWeb3Context, Web3ProviderContext } from '@/web3-context'

type AuthWeb3Context = {
  addr: Web3ProviderContext['address']
  rawProviderSigner: Web3ProviderContext['rawProviderSigner']
}

export default function PostForm() {
  const connectionPromise = useRef<{
    resolve: (value: AuthWeb3Context) => void
    reject: () => void
  } | null>(null)
  const { address, isConnected, rawProviderSigner } = useWeb3Context()
  const { open } = useAppKit()
  const events = useAppKitEvents()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleVerification = async () => {
    let web3Context: AuthWeb3Context = { addr: address, rawProviderSigner }

    await open()
    const connect = new Promise<AuthWeb3Context>((resolve, reject) => {
      connectionPromise.current = { resolve, reject }
    })
    web3Context = await connect

    const signer = web3Context.rawProviderSigner ?? rawProviderSigner
    if (!signer) throw new Error('No provider signer')
    // const signature = await rawProviderSigner.signMessage('challenge')
  }

  useEffect(() => {
    const eventType = events.data.event
    // properties.connected is being included only in the MODAL_CLOSE event
    const isConnectedAfterClose =
      events.data.event === 'MODAL_CLOSE' && events.data.properties.connected

    if (
      (eventType === 'CONNECT_SUCCESS' || isConnectedAfterClose) &&
      address &&
      rawProviderSigner
    ) {
      connectionPromise.current?.resolve({ addr: address, rawProviderSigner })
    }

    // Handling the case when user closes the modal before connection (or the error)
    if (!(eventType === 'MODAL_CLOSE' || eventType === 'CONNECT_ERROR')) return
    if (eventType === 'CONNECT_ERROR' || !isConnectedAfterClose) {
      connectionPromise.current?.reject()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, address, isConnected, rawProviderSigner])

  return (
    <Stack spacing={4}>
      <TextField placeholder='What are you thinking about?' multiline rows={2} />
      <Button variant='contained' size='medium' sx={{ width: 160 }}>
        Post
      </Button>
    </Stack>
  )
}
