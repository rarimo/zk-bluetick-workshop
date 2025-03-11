import { AppKitNetwork, defineChain } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { http } from 'viem'

import { config, NETWORK_CONFIG } from '@/config'

import App from './App'
import { Web3ContextProviderWrapper } from './web3-context'

const activeNetwork = defineChain({
  id: NETWORK_CONFIG.chainId,
  caipNetworkId: `eip155:${NETWORK_CONFIG.chainId}`,
  chainNamespace: 'eip155',
  name: NETWORK_CONFIG.name,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [NETWORK_CONFIG.rpcUrl],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: NETWORK_CONFIG.explorerUrl },
  },
})

const metadata = {
  name: 'ZK BlueTick Workshop UI',
  description: 'ZK BlueTick Workshop UI',
  url: window.location.origin,
  icons: [],
}
const networks: [AppKitNetwork] = [activeNetwork]
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: config.REOWN_ID,
  transports: {
    [activeNetwork.id]: http(activeNetwork.rpcUrls.default.http[0]),
  },
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: config.REOWN_ID,
  metadata,
  themeVariables: {
    '--w3m-z-index': 1500,
  },
  allowUnsupportedChain: false,
  enableEIP6963: false,
  coinbasePreference: 'eoaOnly',
  features: {
    // TODO: find out how to disable Smart Accounts
    smartSessions: false,
    email: false,
    socials: false,
  },
  enableWalletGuide: false,
  allWallets: 'SHOW',
  featuredWalletIds: [],
})

const root = createRoot(document.getElementById('root') as Element)

root.render(
  <StrictMode>
    <Web3ContextProviderWrapper>
      <App />
    </Web3ContextProviderWrapper>
  </StrictMode>,
)
