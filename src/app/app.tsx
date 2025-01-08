'use client'
// import { useEffect, useState } from 'react'
import sdk from '@farcaster/frame-sdk'
import banner from '@/image/BgIndex.png'
import Common from '@/components/ui/common'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import './app-style.css'
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function App() {
  const router = useRouter()
  const { isConnected, address } = useAccount()

  sdk.actions.ready()

  useEffect(() => {
    if (isConnected) {
      router.push('/userAddress')
      console.log(`钱包已连接，地址：${address}`);
    } else {
      console.log('钱包未连接');
    }
  }, [isConnected, address]);

  return (
    <Common>
      <div className='AppPage-Background z-10'>
        <img src={banner.src} alt="" className='AppPage-Background-Img' />
      </div>
      <div className="AppPage-Main relative bg-[#EFFDEC] h-full flex justify-end items-center flex-col py-24">
        <div className='AppPage-Connection'>
          <ConnectButton label='Connect Wallet'></ConnectButton>
        </div>
        {/* <WalletButton wallet="rainbow" /> */}
      </div>
    </Common>
  )
}
