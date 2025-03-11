import { useEffect, useState } from 'react'

import { ErrorHandler } from '@/helpers'

export enum ZkPassEventTypes {
  AuthZkPass = 'AUTH_ZKPASS',
  IllegalWindowClosing = 'ILLEGAL_WINDOW_CLOSING',
  NotMatchRequirements = 'NOT_MATCH_REQUIREMENTS',
  UnexpectedVerifyError = 'UNEXPECTED_VERIFY_ERROR',
  GenerateZkpSuccess = 'GENERATE_ZKP_SUCCESS',
  ProofParameters = 'PROOF_PARAMETERS',
  ProofList = 'PROOF_LIST',
  SetSbtResult = 'SET_SBT_RESULT',
  SbtAddressList = 'SBT_ADDRESS_LIST',
  SbtPubKey = 'SBT_PUB_KEY',
}

export interface ZkPassEventData {
  type: ZkPassEventTypes
  id?: string | number
  details?: Record<string, unknown>
}

export interface ZkPassListenerOptions {
  onIllegalWindowClosing?: (data?: ZkPassEventData) => void
  onNotMatchRequirements?: (data?: ZkPassEventData) => void
  onUnexpectedVerifyError?: (data?: ZkPassEventData) => void
  onGenerateZkpSuccess?: (data?: ZkPassEventData) => void
  onProofParameters?: (data?: ZkPassEventData) => void
  onProofList?: (data?: ZkPassEventData) => void
  onSetSbtResult?: (data?: ZkPassEventData) => void
  onSbtAddressList?: (data?: ZkPassEventData) => void
  onSbtPubKey?: (data?: ZkPassEventData) => void
  onUnhandledEvent?: (eventType: ZkPassEventTypes, data?: ZkPassEventData) => void
  onError?: (errorType: ZkPassEventTypes, errorMessage?: string, data?: ZkPassEventData) => void
}

export const useZkPassListener = (options: ZkPassListenerOptions = {}) => {
  const [zkPassEvent, setZkPassEvent] = useState<ZkPassEventData | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.source === 'zkPass' &&
        Object.values(ZkPassEventTypes).includes(event.data.type)
      ) {
        const zkEvent = event.data as ZkPassEventData
        setZkPassEvent(zkEvent)

        const eventType = zkEvent.type

        switch (eventType) {
          case ZkPassEventTypes.NotMatchRequirements:
            options.onNotMatchRequirements?.(zkEvent)
            options.onError?.(eventType, 'Requirements not met', zkEvent)
            break

          case ZkPassEventTypes.IllegalWindowClosing:
            options.onIllegalWindowClosing?.(zkEvent)
            options.onError?.(eventType, 'Illegal window closing detected', zkEvent)
            break

          case ZkPassEventTypes.UnexpectedVerifyError:
            options.onUnexpectedVerifyError?.(zkEvent)
            options.onError?.(eventType, 'Unexpected verification error occurred', zkEvent)
            break

          case ZkPassEventTypes.GenerateZkpSuccess:
            options.onGenerateZkpSuccess?.(zkEvent)
            break

          case ZkPassEventTypes.ProofParameters:
            options.onProofParameters?.(zkEvent)
            break

          case ZkPassEventTypes.ProofList:
            options.onProofList?.(zkEvent)
            break

          case ZkPassEventTypes.SetSbtResult:
            options.onSetSbtResult?.(zkEvent)
            break

          case ZkPassEventTypes.SbtAddressList:
            options.onSbtAddressList?.(zkEvent)
            break

          case ZkPassEventTypes.SbtPubKey:
            options.onSbtPubKey?.(zkEvent)
            break

          default:
            options.onUnhandledEvent?.(eventType, zkEvent)
            ErrorHandler.processWithoutFeedback(`Unknown event: ${eventType}`)
            break
        }
      }
    }

    window.addEventListener('message', handleMessage, { signal })

    return () => controller.abort()
  }, [options])

  return { zkPassEvent, setZkPassEvent }
}
