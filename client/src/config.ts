import { Chain, CHAIN_TYPES } from '@distributedlab/w3p'
import { AppKitNetwork } from '@reown/appkit/networks'
import { utils } from 'ethers'
import { base } from 'viem/chains'

export interface Config {
  ENV: 'development' | 'production'

  API_URL: string
  APP_HOST_URL: string

  ZK_REGISTRY_CONTRACT: string
  REOWN_ID: string
  ZK_PASS_SCHEMA_ID: string
  ZK_PASS_APP_ID: string

  MESSAGE: string
}

export const config: Config = {
  ENV: import.meta.env.VITE_ENV,

  APP_HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  API_URL: import.meta.env.VITE_API_URL,
  ZK_REGISTRY_CONTRACT: import.meta.env.VITE_ZK_REGISTRY_CONTRACT,
  REOWN_ID: import.meta.env.VITE_REOWN_ID,
  ZK_PASS_SCHEMA_ID: import.meta.env.VITE_ZK_PASS_SCHEMA_ID,
  ZK_PASS_APP_ID: import.meta.env.VITE_ZK_PASS_APP_ID,
  MESSAGE: import.meta.env.VITE_MESSAGE,
}

export interface NetworkConfig {
  chainId: number
  name: string
  rpcUrl: string
  explorerUrl: string
  appKitChain: AppKitNetwork
}

export const NETWORK_CONFIG: NetworkConfig = {
  chainId: base.id,
  name: 'Base Mainnet',
  rpcUrl: 'https://mainnet.base.org',
  explorerUrl: 'https://basescan.org',
  appKitChain: base,
}

export const CONNECTOR_PARAMETERS: Chain = {
  id: utils.hexlify(NETWORK_CONFIG.chainId),
  name: NETWORK_CONFIG.name,
  rpcUrl: NETWORK_CONFIG.rpcUrl,
  explorerUrl: NETWORK_CONFIG.explorerUrl,
  type: CHAIN_TYPES.EVM,
  token: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  icon: '',
}
