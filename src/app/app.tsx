'use client'
import { useEffect, useState } from 'react'
import sdk, { type FrameContext } from '@farcaster/frame-sdk'
import { useRouter } from 'next/navigation'
import { useAccount, useConnect } from 'wagmi'
import { config } from '@/components/providers/WagmiProvider'
import { Button } from '@/components/ui/Button'
import banner from '@/image/WechatIMG263.jpg'
import Common from '@/components/ui/common'
import { Neox } from '@/components/providers/Neox'
export default function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext>()
  const router = useRouter()
  const { connect } = useConnect()
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const showConnect = async () => {
    // debugger
    // console.log(context, address)
    setIsClick(true)
    setLoading(true)
    await load()
    setLoading(false)
    if (address) {
      router.push('/userAddress')
    }
  }
  useEffect(() => {
    console.log(isConnected)

    if (isClick && address && context && context.user.fid) {
      router.push('/userAddress')
    }
  }, [address])
  const load = async () => {
    sdk.actions.ready()
    setContext(await sdk.context)
    // console.log('log')
    // switchChain({ chainId: 47763 })
    connect({ connector: config.connectors[0], chainId: Neox.id })
  }
  useEffect(() => {
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true)
      load()
    }
  }, [isSDKLoaded])
  useEffect(() => {}, [isSDKLoaded])
  return (
    <Common src={banner.src}>
      <div className="flex justify-center items-center flex-col py-28">
        {/* <div className='text-base font-bold'>us</div> */}
        <Button className="mt-2" isLoading={loading} onClick={showConnect}>
          Connect Wallet
        </Button>
      </div>
    </Common>
  )
}
