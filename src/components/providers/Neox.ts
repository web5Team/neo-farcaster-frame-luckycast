// import { defineChain } from 'viem'

// const sourceId = 1 // mainnet

// export const Neox = /*#__PURE__*/ defineChain({
//   id: 47763,
//   name: 'Neo X Mainnet',
//   nativeCurrency: { name: 'Ether', symbol: 'GAS', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ['https://mainnet-1.rpc.banelabs.org'],
//     },
//   },
//   blockExplorers: {
//     default: {Z
//       name: 'Neo X Mainnet',
//       url: 'https://xexplorer.neo.org',
//       apiUrl: 'https://mainnet-1.rpc.banelabs.org',
//     },
//   },
//   // contracts: {
//   //   WGAS10: {
//   //     address: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
//   //   },
//   //   Multicall3: {
//   //     address: '0xD6010D102015fEa9cB3a9AbFBB51994c0Fd6E672',
//   //   },
//   // },
//   sourceId,
// })

import { Wallet, getWalletConnectConnector } from '@rainbow-me/rainbowkit';
export interface MyWalletOptions {
  projectId: string;
}

interface Window {
  NEOLineNeoX: {
    isNEOLine: boolean
  }
}
export const neoX = ({ projectId }: MyWalletOptions): Wallet => {

  const hasNeoX = window.NEOLineNeoX?.isNEOLine

  return {
    id: '47_763',
    name: 'NeoX',
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    iconBackground: '#fff',
    installed: hasNeoX,
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=my.wallet',
      ios: 'https://apps.apple.com/us/app/my-wallet',
      chrome: 'https://chrome.google.com/webstore/detail/my-wallet',
      qrCode: 'https://my-wallet/qr',
       },
    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: 'https://my-wallet/learn-more',
        steps: [
          {
            description:
              'We recommend putting My Wallet on your home screen for faster access to your wallet.',
            step: 'install',
            title: 'Open the My Wallet app',
          },
          {
            description:
              'After you scan, a connection prompt will appear for you to connect your wallet.',
            step: 'scan',
            title: 'Tap the scan button',
          },
        ],
      },
    },
    extension: {
      instructions: {
        learnMoreUrl: 'https://chromewebstore.google.com/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao',
        steps: [
          {
            description:
              'We recommend pinning My Wallet to your taskbar for quicker access to your wallet.',
            step: 'install',
            title: 'Install the My Wallet extension',
          },
          {
            description:
              'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
            step: 'create',
            title: 'Create or Import a Wallet',
          },
          {
            description:
              'Once you set up your wallet, click below to refresh the browser and load up the extension.',
            step: 'refresh',
            title: 'Refresh your browser',
          },
        ],
      },
    },
    createConnector: getWalletConnectConnector({ projectId }),
  }

};