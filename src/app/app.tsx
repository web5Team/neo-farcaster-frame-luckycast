'use client'
import sdk from '@farcaster/frame-sdk'
import indexTitle from '@/image/index/IndexTitle.png'
import indexIllustrator from '@/image/index/IndexIllustrator.png'
import Common from '@/components/ui/common'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import './app-style.css'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  isAndroid,
  isChrome,
  isDesktop,
  isEdge,
  isFirefox,
  isIE,
  isIOS,
  isMacOs,
  isMobile,
  isMobileOnly,
  isMobileSafari,
  isSafari,
  isTablet,
  isWindows,
} from 'react-device-detect';
import InfoDialog from '@/components/ui/InfoDialog'

export default function App() {
  const router = useRouter()
  const { isConnected, address } = useAccount()

  const [notSupportYet, setNotSupportYet] = useState(false)

  sdk.actions.ready()

  useEffect(() => {
    if (isMobile || isIOS) {
      setNotSupportYet(true)

      return
    }

    if (isConnected) {
      router.push('/userAddress')
      console.log(`钱包已连接，地址：${address}`)
    } else {
      console.log('钱包未连接')
    }
  }, [isConnected, address, notSupportYet])



  return (
    <Common>
      <div className='AppPage-Main min-h-screen bg-[#EFFDEC] flex flex-col items-center justify-between px-4 py-8 md:py-12'>
        {/* 标题部分 */}
        <div className='w-full px-16 max-w-md mt-8 md:mt-12'>
          <img
            src={indexTitle.src}
            alt="LuckyCast Title"
            className='w-full object-contain'
          />
        </div>

        {/* 中间插画部分 */}
        <div className='w-full px-12 max-w-lg my-8 md:my-12'>
          <img
            src={indexIllustrator.src}
            alt="LuckyCast Illustration"
            className='w-full object-contain'
          />
        </div>

        {/* 连接钱包按钮 */}
        <div className='mb-4 md:mb-12 AppPage-Connection'>
          <ConnectButton />
        </div>
      </div>

      {notSupportYet && (
        <InfoDialog
          emoji="🥺"
          isOpen={notSupportYet}
        >
          <div className="text-black my-4 text-center">
            <p className="font-bold text-2xl">SORRY~</p>
            <p className='text-[#C7C7C7]'>Mobile is not yet supported, please go to your computer to use this app.</p>
          </div>
        </InfoDialog>
      )}
    </Common>
  )
}
