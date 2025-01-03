import {  WagmiProvider } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
// import { Neox } from './Neox'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
// import ConnectToDefault from './NeoxProvider'

export const config = getDefaultConfig({
   appName: 'RainbowKit demo',
   projectId: '9ae9e04b154850d9edb3b5efe96ae2f2',
  chains: [mainnet, polygon, optimism, arbitrum, base],
 })

const queryClient = new QueryClient()

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
