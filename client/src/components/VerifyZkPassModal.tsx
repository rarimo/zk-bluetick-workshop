import CheckIcon from '@mui/icons-material/Check'
import { Box, Dialog, DialogProps, Divider, Stack, Typography, useTheme } from '@mui/material'
import { useEvent } from '@reactuses/core'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti-boom'

import BlueCheckMarkIcon from '@/assets/blue-check-mark-icon.svg?react'
import { bus, BusEvents, ErrorHandler } from '@/helpers'
import { useZkPassListener } from '@/hooks/zk-pass.events'
import { useZkRegistry } from '@/hooks/zk-registry'
import { rippleAnimation } from '@/theme/constants'
import { useWeb3Context } from '@/web3-context'

export const ZK_PASS_EXTENSION_URL =
  'https://chromewebstore.google.com/detail/zkpass-transgate/afkoofjocpbclhnldmmaphappihehpma'

type VerificationStatuses = 'pending' | 'active' | 'completed'

enum VerificationStepStates {
  Attesting,
  RegistrationCommitment,
  RegistrationCompleting,
  GeneratingProof,
  Completed,
}

export interface Props extends Omit<DialogProps, 'open'> {
  isOpen: boolean
  onOpen?: () => void
  onClose?: () => void
}

export function ZkPassVerificationModal({ isOpen, onOpen, onClose, ...rest }: Props) {
  const [verificationStep, setVerificationStep] = useState<VerificationStepStates | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const { zkRegistry, registerUserOnZkRegistry } = useZkRegistry()
  const { address } = useWeb3Context()
  const { palette } = useTheme()

  useZkPassListener({
    onGenerateZkpSuccess: () => {
      setVerificationStep(VerificationStepStates.RegistrationCommitment)
    },
    onError: (_, message) => {
      bus.emit(BusEvents.error, { message })
      setVerificationStep(null)
    },
  })

  const verify = useEvent(async () => {
    onOpen?.()
    setIsSuccess(false)

    try {
      if (!zkRegistry || !address) {
        throw new Error('ZKRegistry contract or address is not available')
      }

      let handleHashFromContract = await zkRegistry.userHandles(address)

      // User is not registered
      if (Number(handleHashFromContract) === 0) {
        setVerificationStep(VerificationStepStates.Attesting)

        await registerUserOnZkRegistry({
          onFirstTxDone: () => {
            setVerificationStep(VerificationStepStates.RegistrationCompleting)
          },
        })

        const newHandleHash = await zkRegistry.userHandles(address)

        if (Number(newHandleHash) === 0) {
          throw new Error('Registration failed: handleHash is still zero after registration')
        }

        handleHashFromContract = newHandleHash
      }

      // User is already registered
      setVerificationStep(VerificationStepStates.GeneratingProof)
      // const payload = await getSmtProofPayload(handleHashFromContract)
      // await submitZkPassProof(payload)
      // await authStore.loadAccount(address)

      bus.emit(BusEvents.success, {
        title: 'Verification Completed',
        message: 'Your blue checkmark is verified!',
      })

      setVerificationStep(VerificationStepStates.Completed)
      setIsSuccess(true)
      setTimeout(() => onClose?.(), 7_000)
    } catch (error) {
      ErrorHandler.process(error)
      setVerificationStep(null)
      onClose?.()
    }
  })

  const getSignatureStatus = (state: VerificationStepStates): VerificationStatuses => {
    if (verificationStep === null || state > verificationStep) return 'pending'
    return state === verificationStep ? 'active' : 'completed'
  }

  const verificationSteps: Omit<VerificationStepProps, 'order'>[] = [
    {
      title: 'Attesting Your Blue Checkmark',
      description: 'Follow the instructions in the TransGate popup when the X tab opens.',
      status: getSignatureStatus(VerificationStepStates.Attesting),
    },
    {
      title: 'Creating an On-Chain Commitment',
      description: 'Confirm the first transaction (1/2).',
      status: getSignatureStatus(VerificationStepStates.RegistrationCommitment),
    },
    {
      title: 'Adding Your Blue Checkmark to the ZK Registry',
      description: 'Confirm the second transaction (2/2).',
      status: getSignatureStatus(VerificationStepStates.RegistrationCompleting),
    },
    {
      title: 'Proving Your ZK Registry Membership',
      description: 'Generate a zero-knowledge proof of inclusion.',
      status: getSignatureStatus(VerificationStepStates.GeneratingProof),
    },
  ]

  useEffect(() => {
    if (isOpen) verify()
  }, [isOpen, verify])

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        position: 'relative',
        sx: { width: 455 },
      }}
      {...rest}
    >
      <Box
        p={5}
        flex={1}
        overflow='hidden auto'
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={6}
        textAlign='center'
      >
        {isSuccess && (
          <Confetti
            mode='fall'
            particleCount={65}
            shapeSize={15}
            colors={[palette.success.main, palette.primary.light, palette.primary.dark]}
          />
        )}
        <BlueCheckMarkIcon width={48} height={48} />
        <Stack spacing={2} alignItems='center'>
          <Typography variant='subtitle2'>Verify Your X Blue Checkmark!</Typography>
          <Typography
            whiteSpace='pre-wrap'
            variant='body3'
            color={palette.text.secondary}
            maxWidth={375}
          >
            Utilize ZK technology to verify your X profile securely and privately.
          </Typography>
        </Stack>
        <Divider flexItem />
        <Stack spacing={1} width='100%' textAlign='left' sx={{ pb: 3 }}>
          {verificationSteps.map(({ title, status, description }, index) => (
            <VerificationStep
              key={index}
              title={title}
              status={status}
              order={index + 1}
              description={description}
              hasDivider={index < verificationSteps.length - 1}
            />
          ))}
        </Stack>
      </Box>
    </Dialog>
  )
}

interface VerificationStepProps {
  title: string
  description?: string
  order: number
  status: VerificationStatuses
  hasDivider?: boolean
}

function VerificationStep({
  title,
  description,
  order,
  status,
  hasDivider = false,
}: VerificationStepProps) {
  const { palette } = useTheme()

  return (
    <Box
      display='grid'
      gridTemplateColumns='auto 1fr'
      gap={4}
      color={
        status === 'active'
          ? palette.primary.main
          : status === 'pending'
            ? palette.text.primary
            : palette.text.secondary
      }
    >
      <Stack spacing={1}>
        <Stack
          position='relative'
          alignItems='center'
          justifyContent='center'
          bgcolor={status === 'active' ? 'transparent' : palette.action.active}
          border={`1px solid ${status === 'active' ? palette.primary.main : 'transparent'}`}
          borderRadius='50%'
          width='100%'
          minWidth={32}
          minHeight={32}
          my={0.75}
        >
          {status === 'active' && (
            <Stack
              position='absolute'
              top={0}
              left={0}
              right={0}
              bottom={0}
              border={`1px solid ${palette.primary.main}`}
              alignItems='center'
              justifyContent='center'
              borderRadius='50%'
              sx={{ animation: `${rippleAnimation} 1.2s infinite ease-out` }}
            />
          )}
          {status === 'completed' ? (
            <CheckIcon sx={{ fontSize: 20, color: 'inherit' }} />
          ) : (
            <Typography variant='body4' sx={{ ml: 0.3 }}>
              {order}
            </Typography>
          )}
        </Stack>
        {hasDivider && (
          <Box
            minHeight={16}
            height='100%'
            width={2}
            borderRadius={1}
            bgcolor={palette.divider}
            mx={3.75}
          />
        )}
      </Stack>
      <Stack justifyContent={hasDivider ? 'flex-start' : 'center'}>
        <Typography
          variant='subtitle4'
          color={status === 'completed' ? palette.text.secondary : palette.text.primary}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant='body4'
            color={status === 'completed' ? palette.text.disabled : palette.text.secondary}
          >
            {description}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
