'use client'

import React from 'react'
// import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Input, message, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import Common from '@/components/ui/common'
import { Button } from '@/components/ui/Button'
import banner from '@/image/WechatIMG263.jpg'
import {
  useSumbitDataMutation,
  useVerifyTranspondMutation,
} from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import disposition from '@/composables/disposition'
export default function UserAddress() {
  const [context, setContext] = useState<FrameContext>()
  const { address } = useAccount()
  // const { connect } = useConnect()
  const [teamCode, setTeamCode] = useState('')
  const [verify, setVerify] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: SumbitData } = useSumbitDataMutation()
  const { mutateAsync: VerifyTranspond } = useVerifyTranspondMutation()
  const router = useRouter()
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
          router.push('/wait')
        } else if (res.msg == 'The current data has been submitted') {
          messageApi.open({
            type: 'info',
            content: "You've joined the team",
          })
          router.push('/wait')
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
  const [showOpen,setShowOpen] = useState(false)
  return (
    <>
      <Common src={banner.src}>
        <>{contextHolder}</>
        <div className="page-content pb-6">
          <div className="flex justify-end text-sm text-[#999] hover:text-[#7866bb] transition-all   mt-2 mr-2 cursor-pointer">
            <span onClick={()=>setShowOpen(true)} className="">help?</span>
          </div>
          <div className="flex  max-md:w-full pt-10  px-6 flex-col gap-1.5 text-base">
            <div className="max-md:w-[112px] max-md:text-[14px] text-[#727a81]">
              Your Address:
            </div>
            <div className="text-sm flex-1 mb-3  break-words dark:text-black">
              {address || 'no Address'}
              {/* 0xcc76a9BeEf0dF6F0ccD29515588c245F98744351 */}
            </div>
            <div className="max-md:w-[112px] max-md:text-[14px] text-[#727a81]">
              Your Team Code:
            </div>
            <Input
              value={teamCode}
              className="w-[320px] max-md:w-full flex-1"
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="(Optional)"
              variant="filled"
            />
            <div className="mt-5 text-base flex justify-center items-center gap-6">
              <Button
                isLoading={loading.recastLoading}
                isDefault={true}
                onClick={recast}
              >
                Recast
              </Button>
              <Button isLoading={loading.sumbitLoading} onClick={sumbit}>
                Sumbit
              </Button>
            </div>
          </div>
          <Modal open={showOpen} onOk={()=>setShowOpen(false)} onCancel={()=>setShowOpen(false)}>
            <div>this is a help session.</div>
          </Modal>
        </div>
      </Common>
    </>
  )
}
