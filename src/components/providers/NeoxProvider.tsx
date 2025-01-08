import {
  RainbowKitProvider,
  getDefaultConfig,
  Chain,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { defineChain } from 'viem';


export const NeoxProvider = defineChain({
  id: 47_763,
  name: 'NeoX Mainnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Ether', symbol: 'GAS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet-1.rpc.banelabs.org'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://xexplorer.neo.org' },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
})