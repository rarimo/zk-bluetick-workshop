import { EventEmitter } from '@distributedlab/tools'

import { ToastPayload } from '@/components/toasts-manager'

export enum BusEvents {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
}

export type BusEventMap = {
  [BusEvents.success]: ToastPayload
  [BusEvents.error]: ToastPayload
  [BusEvents.warning]: ToastPayload
  [BusEvents.info]: ToastPayload
}

export const bus = new EventEmitter<BusEventMap>()
