import { time, TimeDate } from '@distributedlab/tools'

export function formatDateDM(date: TimeDate) {
  return time(date).format('D MMM')
}

export function formatTimeFromNow(date: TimeDate) {
  return time(date).fromNow
}

export function formatAddress(address?: string) {
  return address ? `${address.slice(0, 8)}...${address.slice(-8)}` : '–'
}
