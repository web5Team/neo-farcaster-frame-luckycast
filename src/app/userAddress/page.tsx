'use client'

import React from 'react'
// import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Input, message } from 'antd'
import { useRouter } from 'next/navigation'
import Common from '@/components/ui/common'
import { Button } from '@/components/ui/Button'
import banner from '@/image/BgHeader.png'
import avatar from '@/image/avatar.png'
import help from '@/image/HELP_.png'
import circleCheck from '@/image/check circle.svg'
import {
  useSumbitDataMutation,
  useVerifyTranspondMutation,
} from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import disposition from '@/composables/disposition'
import AccountUrlDisplayer from '@/components/ui/AccountUrlDisplayer'
import './user-style.css'
import InfoDialog from '@/components/ui/InfoDialog'
import Wait from '../../components/WaitAirDrop'
import { createPortal } from 'react-dom'

export default function UserAddress() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [context, setContext] = useState<FrameContext>()
  const { disconnect } = useDisconnect()

  const [teamCode, setTeamCode] = useState('')
  const [verify, setVerify] = useState(false)
  const [done, setDone] = useState(false)
  const [userInfo, setUserInfo] = useState({ picUrl: '', displayName: '', fid: -1, username: '' })
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: SumbitData } = useSumbitDataMutation()
  const { mutateAsync: VerifyTranspond } = useVerifyTranspondMutation()

  async function trySignIn() {
    const nonce = [...((address?.substring(0, 8) || '') + Date.now())].reverse().join('')

    try {

      const res = await sdk.actions.signIn({ nonce })
      console.log("context", res)

    } catch (e) {
      messageApi.warning('Please signin to continue')

      trySignIn()

      console.log(e)
    }
  }

  useEffect(() => {
    if (isConnected) {
      messageApi.success('Connected')
      console.log(`钱包已连接，地址：${address}`);

      setTimeout(async () => {
        const res = (await sdk.context).user

        if (res.username) {
          setUserInfo({
            fid: res.fid,
            username: res.username,
            displayName: res.displayName || '',
            picUrl: res.pfpUrl || avatar.src,
          })
        } else {
          trySignIn()
        }

      })
    } else {
      messageApi.error('Please connect your wallet first.')
      router.push('/')
    }
  }, [isConnected, address]);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
    }
    load()
  }, [])

  const [loading, setLoading] = useState({
    recastLoading: false,
    sumbitLoading: false,
  })
  const recast = async () => {
    if (context && context?.user.fid) {
      setLoading({
        ...loading,
        recastLoading: true,
      })
      VerifyTranspond({ fid: context?.user.fid + '' }).then(
        () => {
          setLoading({
            ...loading,
            recastLoading: false,
          })
          setVerify(true)
          messageApi.success('Recast Successfully')
        },
        () => {
          setLoading({
            ...loading,
            recastLoading: false,
          })
          sdk.actions.openUrl(disposition.openUrl)
        }
      )
    }
  }
  const sumbit = () => {
    if (!verify) {
      messageApi.open({
        type: 'error',
        content: 'Please Recast',
      })
      return
    }
    if (context && context?.user.fid) {
      setLoading({
        ...loading,
        sumbitLoading: true,
      })
      SumbitData({
        fid: context?.user.fid + '',
        nickname: context?.user.username || '',
        email: '',
        address: address + '',
        team_code: teamCode.trim(),
      }).then((res) => {
        setLoading({
          ...loading,
          sumbitLoading: false,
        })
        if (res.code === 1) {
          messageApi.open({
            type: 'success',
            content: 'Join the team successfully',
          })
          setDone(true)
        } else if (res.msg == 'The current data has been submitted') {
          messageApi.open({
            type: 'info',
            content: "You've joined the team",
          })
          setDone(true)
        } else if (teamCode.trim() && res.code === 0) {
          messageApi.error('Team code error')
        }
      })
    } else {
      messageApi.open({
        type: 'warning',
        content: teamCode.trim()
          ? 'Please Connect Wallet'
          : 'please input team code',
      })
    }
  }
  const [showOpen, setShowOpen] = useState(false)

  return (
    <>
      <Common className='bg-[#EFFDEC]' src={banner.src}>
        <div className="UserPage-Displayer">
          <AccountUrlDisplayer text={address || ''} />
        </div>
        <div onClick={() => disconnect()} className="UserPage-Disconnection">
          <button>Disconnect</button>
        </div>

        <div className='UserPage-Avatar z-10'>
          <img src={userInfo.picUrl} alt="Avatar" />
        </div>
        <>{contextHolder}</>

        <div className="relative bg-[#F7FBFA]  mt-[-25%] page-content pb-6">
          <div onClick={() => setShowOpen(true)} className="absolute text-sm text-[#999] hover:text-[#7866bb] transition-all right-2 top-2 mt-2 mr-2 cursor-pointer">
            <img src={help.src} alt="HELP" />
          </div>

          <div className='pt-20 text-[24px] text-black mx-8 font-bold'>
            <p>@{userInfo.username}</p>
          </div>

          <div className="flex items-center pt-10  px-6 gap-1.5 text-base">
            <div className="max-md:text-[14px] font-bold mx-1 text-[#727a81]">
              Team Code
            </div>
            <Input
              value={teamCode}
              className="w-[150px] rounded-1xl py-2"
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Optional"
              variant="filled"
            />
          </div>

          {/* <Modal open={showOpen} onOk={() => setShowOpen(false)} onCancel={() => setShowOpen(false)}>
            <div>this is a help session.</div>
          </Modal> */}

          {done && createPortal((
            <div className='UserPage-Wait'>
              <Wait />
            </div>
          ), document.body)}

          <InfoDialog emoji="🧐" isOpen={showOpen} onClose={() => setShowOpen(false)}>
            <div className='text-black my-4 text-center'>
              <p className='font-bold text-2xl'>HELP?</p>
              <ul className="list-disc list-inside text-left text-[#868686]">
                <li>
                  <span className='-ml-2'>Recast first, then submit your information to claim the airdrop.</span>
                </li>
                <li>
                  <span className='-ml-2'>Join a KOL team using a code to get a multiplier bonus.</span>
                  </li>
                <li>
                  <span className='-ml-2'>Each FID can only be bound to one valid address to receive airdrops.</span>
                  </li>
                <li>
                  <span className='-ml-2'>Stay tuned for more airdrops from Neo in the future.</span>
                  </li>
              </ul>
            </div>
          </InfoDialog>
        </div>

        <div className="mt-5 mx-auto w-[80%] text-base flex flex-col justify-center items-center gap-6">
          <Button
            isLoading={loading.recastLoading}
            isDefault={true}
            onClick={recast}
            className='bg-[#DCC1FE] text-white'
          >
            <div className='flex items-center justify-center gap-2'>
              {verify && (<img src={circleCheck.src} alt="check" />)} Recast
            </div>
          </Button>
          <Button className='bg-[#A0A0A0]' isLoading={loading.sumbitLoading} onClick={sumbit}>
            Sumbit
          </Button>
          <p className='font-[12px] text-[#9E9E9E]'>You have to recast first.</p>
        </div>
      </Common>
    </>
  )
}
