'use client'
// import { useEffect, useState } from 'react'
import sdk from '@farcaster/frame-sdk'
import banner from '@/image/WechatIMG263.jpg'
import Common from '@/components/ui/common'
import { ConnectButton, WalletButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export default function App() {

  sdk.actions.ready()

  return (
    <Common src={banner.src}>
      <div className="flex justify-center items-center flex-col py-28">
        <ConnectButton></ConnectButton>
        <WalletButton wallet="rainbow" />
      </div>
    </Common>
  )
}
