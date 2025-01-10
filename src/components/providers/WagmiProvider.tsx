import { WagmiProvider } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia
} from 'wagmi/chains';
import { createConfig, http } from '@wagmi/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
// import { Neox } from './Neox'
import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { NeoxProvider } from './NeoxProvider';
// import ConnectToDefault from './NeoxProvider'
import * as WALLETS from '@rainbow-me/rainbowkit/wallets';
import { neoX } from './Neox'

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [neoX, WALLETS.wigwamWallet],
//     },
//   ],
//   {
//     appName: 'My RainbowKit App',
//     projectId: 'YOUR_PROJECT_ID',
//   }
// );

// setTimeout(() => {
 
//   console.log( WALLETS.safeWallet (), JSON.stringify(window.ethereum.providers))
// }, 1000)

// export const config = createConfig({
//   chains: [NeoxProvider, mainnet, polygon, optimism, arbitrum, base],
//   transports: {
//       [NeoxProvider.id]: http(),
//     [mainnet.id]: http(),
//     [polygon.id]: http(),
//     [optimism.id]: http(),
//     [arbitrum.id]: http(),
//     [base.id]: http(),
//   },
//   // wallets: [rainbowWallet]
//   connectors,
//   // appName: 'RainbowKit demo',
//   // projectId: '9ae9e04b154850d9edb3b5efe96ae2f2',
//   // chains: [NeoxProvider, mainnet, polygon, optimism, arbitrum, base],
// })

export const config = getDefaultConfig({
  appName: 'luckycast',
  projectId: '9ae9e04b154850d9edb3b5efe96ae2f2',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
});

const queryClient = new QueryClient()

export default function Provider({ children }: { children: React.ReactNode }) {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
