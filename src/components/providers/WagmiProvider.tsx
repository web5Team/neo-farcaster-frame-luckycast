import { createConfig, http, WagmiProvider } from 'wagmi'
import { base, optimism } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { Neox } from './Neox'
import ConnectToDefault from './NeoxProvider'

export const config = createConfig({
  chains: [Neox, base, optimism],
  transports: {
    [Neox.id]: http(Neox.rpcUrls.default.http[0]),
    [base.id]: http(),
    [optimism.id]: http(),
  },
  connectors: [farcasterFrame()],
})

const queryClient = new QueryClient()

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ConnectToDefault />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
