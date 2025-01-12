'use client'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useGetRewardMutation } from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import AccountUrlDisplayer from './ui/AccountUrlDisplayer'
import { useAccount, useDisconnect } from 'wagmi'
import './WaitAirDrop.css'
import Congratulations from './Congradulations'
import InfoDialog from './ui/InfoDialog'
import { useOnClickOutside } from 'usehooks-ts'
import { createPortal } from 'react-dom'

export default function Wait() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [claim, setClaim] = useState(false)
  const [context, setContext] = useState<FrameContext>()
  const { mutateAsync: GetReward } = useGetRewardMutation()
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
    }
    load()
  }, [])
  const [messageApi, contextHolder] = message.useMessage()
  const recast = () => {
    setLoading(true)
    GetReward({ fid: context?.user.fid + '' }).then((res) => {
      setLoading(false)
      if (res.code === 1) {
        if (res.data.status === 4) {
          router.push('/rank')
        } else if (res.data.status === 2 || res.data.status === 3) {
          setClaim(true)
        } else if (res.data.status === 1) {
          messageApi.info('To be reviewed')
        }
      }
    })
  }

  const { disconnect } = useDisconnect()
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClickOutside = () => {
    setIsVisible(false)
  };
  useOnClickOutside(wrapperRef, handleClickOutside);

  return (
    <>
      <>{contextHolder}</>
      {!claim && createPortal((
        <div className='WaitPage-Header'>
          <div onClick={() => setIsVisible(true)} className="WaitPage-Displayer">
            <AccountUrlDisplayer text={address || ''} />
          </div>
          <div ref={wrapperRef} style={{ display: isVisible ? '' : 'none' }} onClick={() => disconnect()} className="UserPage-Disconnection z-1">
            <button>Disconnect</button>
          </div>
        </div>
      ), document.body)}

      <InfoDialog isOpen={true} emoji="🤩" onClose={() => void 0} className={'WaitPage-Main px-10 py-28 flex justify-center items-center gap-2 flex-col' + (claim ? ' hidden' : '')}>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Great!</h1>
          <p className='max-w-[85%] my-2 font-[12px] text-[#C7C7C7]'>You have successfully submitted and are awaiting confirmation.</p>
          {/* <Spin className='text-base font-bold' tip="wait..."></Spin> */}
          <Button
            isLoading={loading}
            onClick={recast}
            className="px-16 max-md:px-10 mt-4"
          >
            Refresh status
          </Button>
        </div>
      </InfoDialog>

      <InfoDialog emoji='🥳' isOpen={claim} onClose={() => setClaim(false)}>
        <Congratulations />
      </InfoDialog>
    </>
  )
}
