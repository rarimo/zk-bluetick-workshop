import {
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useAppKit, useAppKitEvents } from '@reown/appkit/react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

import { config } from '@/config'
import { bus, BusEvents, ErrorHandler } from '@/helpers'
import { useZkRegistry } from '@/hooks/zk-registry'
import { useWeb3Context, Web3ProviderContext } from '@/web3-context'

import { ZkPassVerificationModal } from './VerifyZkPassModal'

type AuthWeb3Context = {
  addr: Web3ProviderContext['address']
  rawProviderSigner: Web3ProviderContext['rawProviderSigner']
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function PostForm({ onSubmit }: { onSubmit: () => void }) {
  const connectionPromise = useRef<{
    resolve: (value: AuthWeb3Context) => void
    reject: () => void
  } | null>(null)
  const { address, isConnected, rawProviderSigner } = useWeb3Context()
  const { open } = useAppKit()
  const events = useAppKitEvents()
  const [isZkPassVerified, setIsZkPassVerified] = useState(false)
  const { checkZkPass, isZkPassChecking } = useZkRegistry()
  const [isZkPassModalOpen, setIsZkPassModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const textfieldRef = useRef<HTMLInputElement | null>(null)
  const imageRef = useRef<HTMLInputElement | null>(null)

  const updatePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file)
        setPreviewImage(imageUrl)
      } else {
        bus.emit(BusEvents.error, { message: 'Please upload a valid image file' })
      }
    }
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

  const sendPost = async () => {
    const text = textfieldRef.current?.value
    if (!text) {
      return
    }

    const signature = await rawProviderSigner?.signMessage(config.MESSAGE)

    const formData = new FormData()
    formData.append('author', address)
    formData.append('text', text)
    formData.append('signature', signature ?? '')

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0]
      formData.append('picture', file)
    }

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      bus.emit(BusEvents.success, {
        message: "You've successfully sent a post",
      })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      if (textfieldRef.current) {
        textfieldRef.current.value = ''
        setPreviewImage(null)
        setTimeout(() => {
          onSubmit()
        }, 1_000)
      }
    }
  }

  useEffect(() => {
    const verifyZkPass = async () => {
      setIsZkPassVerified(await checkZkPass(address))
    }

    verifyZkPass()
  }, [address, checkZkPass])

  if (!isConnected || !address) {
    return (
      <Stack>
        <Button onClick={() => open()}>Connect wallet</Button>
      </Stack>
    )
  }

  return (
    <>
      <Stack spacing={4}>
        {!isZkPassChecking && !isZkPassVerified && (
          <VerifyZkPassBlock
            isModalOpen={isZkPassModalOpen}
            onOpen={() => setIsZkPassModalOpen(true)}
            onClose={() => setIsZkPassModalOpen(false)}
          />
        )}
        {isZkPassVerified && (
          <Stack spacing={3}>
            <FormControl>
              <TextField
                inputRef={textfieldRef}
                placeholder='What are you thinking about?'
                multiline
                rows={2}
              />
              <FormHelperText>Your address: {address}</FormHelperText>
            </FormControl>
            <Button
              sx={{ width: 'fit-content' }}
              variant='outlined'
              component='label'
              size='small'
              role={undefined}
              tabIndex={-1}
            >
              Upload photo
              <VisuallyHiddenInput ref={imageRef} type='file' onChange={updatePicture} />
            </Button>
            {previewImage && (
              <img
                src={previewImage}
                alt='Selected preview'
                style={{
                  maxWidth: '100%',
                  borderRadius: 8,
                  marginTop: 8,
                  width: 80,
                  height: 50,
                  objectFit: 'cover',
                }}
              />
            )}
            <Button
              variant='contained'
              size='medium'
              sx={{ width: 160 }}
              disabled={isZkPassChecking || !isZkPassVerified}
              onClick={sendPost}
            >
              Post
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  )
}

function VerifyZkPassBlock({
  isModalOpen,
  onOpen,
  onClose,
}: {
  isModalOpen: boolean
  onClose: () => void
  onOpen: () => void
}) {
  const { palette } = useTheme()

  return (
    <>
      <Stack
        component={Paper}
        spacing={2}
        direction='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Stack spacing={2}>
          <Typography variant='h3'>Ready to make a post?</Typography>
          <Typography variant='body3' color={palette.text.secondary}>
            First, let&apos;s complete the zkPass verification to get started!
          </Typography>
        </Stack>
        <Button size='medium' onClick={onOpen}>
          Verify zkPass
        </Button>
      </Stack>
      <ZkPassVerificationModal isOpen={isModalOpen} onClose={onClose} />
    </>
  )
}
