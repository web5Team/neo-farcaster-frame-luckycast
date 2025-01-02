import { defineChain } from 'viem'

const sourceId = 1 // mainnet

export const Neox = /*#__PURE__*/ defineChain({
  id: 47763,
  name: 'Neo X Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'GAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet-1.rpc.banelabs.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Neo X Mainnet',
      url: 'https://xexplorer.neo.org',
      apiUrl: 'https://mainnet-1.rpc.banelabs.org',
    },
  },
  // contracts: {
  //   WGAS10: {
  //     address: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
  //   },
  //   Multicall3: {
  //     address: '0xD6010D102015fEa9cB3a9AbFBB51994c0Fd6E672',
  //   },
  // },
  sourceId,
})
