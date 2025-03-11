import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import { AppKitNetwork } from '@reown/appkit/networks'
import { useAppKitAccount, useAppKitEvents, useAppKitNetwork } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { providers } from 'ethers'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import {
  Connector,
  useConnect,
  useConnections,
  useConnectorClient,
  UseConnectReturnType,
  useDisconnect,
  WagmiProvider,
} from 'wagmi'

import { NETWORK_CONFIG } from '@/config'
import { wagmiAdapter } from '@/main'

function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const rpcUrl = transport.url || chain.rpcUrls.default.http[0]
  return new providers.StaticJsonRpcProvider(rpcUrl, network)
}

function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  return provider.getSigner(account.address)
}

export type Web3ProviderContext<A extends Account | undefined = Account | undefined> = {
  connectManager: UseConnectReturnType

  client: Client<Transport, Chain, A> | null

  address: string | ''
  chain: string | number | null
  isConnected: boolean
  isInitialized: boolean

  isCorrectNetwork: boolean
  contractConnector: providers.JsonRpcProvider | null
  rawProviderSigner: providers.JsonRpcSigner | null
  connect: (connector: Connector) => Promise<void>
  disconnect: () => Promise<void>

  safeSwitchChain: (chain: AppKitNetwork) => void
  signAndSendTx: (tx: Deferrable<TransactionRequest>) => Promise<providers.TransactionReceipt>
}

const web3ProviderContext = createContext<Web3ProviderContext>({
  connectManager: {} as UseConnectReturnType,
  client: null,

  address: '',
  chain: null,
  isConnected: false,
  isInitialized: false,

  isCorrectNetwork: false,
  contractConnector: null,
  rawProviderSigner: null,

  connect: async () => {},
  disconnect: async () => {},

  safeSwitchChain: () => {},
  signAndSendTx: async () => ({}) as providers.TransactionReceipt,
})

export const useWeb3Context = () => {
  return useContext(web3ProviderContext)
}

const queryClient = new QueryClient()

export const Web3ContextProviderWrapper = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3ContextProvider>{children}</Web3ContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const Web3ContextProvider = ({ children }: PropsWithChildren) => {
  const [isInitialized, setIsInitialized] = useState(false)

  const connectManager = useConnect()
  const { isConnected, address, status } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const appKitEvent = useAppKitEvents()
  const { disconnectAsync } = useDisconnect()
  const connections = useConnections()

  const connect = useCallback(
    async (connector: Connector) => {
      await connectManager.connectAsync({ connector })
    },
    [connectManager],
  )

  // Disconnect any social login
  useEffect(() => {
    const disconnectIdAuth = async () => {
      const idAuthConnection = connections.find(connection => connection.connector.id === 'ID_AUTH')
      if (!idAuthConnection) return
      await idAuthConnection.connector?.disconnect()
      window.location.reload()
    }
    disconnectIdAuth()
  }, [connections])

  const { data: walletClient } = useConnectorClient({ config: wagmiAdapter.wagmiConfig })
  if (walletClient) {
    // TODO: take a look if it works
    walletClient.pollingInterval = 10000
  }

  const client = useMemo(() => {
    return walletClient as Client<Transport, Chain, Account>
  }, [walletClient])

  const contractConnector = useMemo(() => {
    if (!client) return null
    return clientToProvider(client)
  }, [client])

  const rawProviderSigner = useMemo(() => {
    if (!client?.account) return null
    return clientToSigner(client as Client<Transport, Chain, Account>)
  }, [client])

  const isCorrectNetwork = useMemo((): boolean => {
    return chainId === NETWORK_CONFIG.chainId
  }, [chainId])

  const safeSwitchChain = useCallback(
    (chain: AppKitNetwork) => {
      switchNetwork(chain)
    },
    [switchNetwork],
  )

  const signAndSendTx = useCallback(
    async (tx: Deferrable<TransactionRequest>) => {
      const txResponse = await clientToSigner(client).sendTransaction(tx)

      return txResponse.wait()
    },
    [client],
  )

  useEffect(() => {
    if (appKitEvent?.data.event === 'MODAL_LOADED' || appKitEvent?.data.event === 'INITIALIZE') {
      setIsInitialized(true)
    }
  }, [appKitEvent, status])

  return (
    <web3ProviderContext.Provider
      value={{
        connectManager,

        client,

        address: address ?? '',
        chain: chainId ?? '',
        isConnected,
        isInitialized,

        isCorrectNetwork,

        connect,
        disconnect: disconnectAsync,

        safeSwitchChain,
        signAndSendTx,

        contractConnector,
        rawProviderSigner,
      }}
    >
      {children}
    </web3ProviderContext.Provider>
  )
}
