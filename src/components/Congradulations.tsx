'use client'
import { Button } from '@/components/ui/Button'
import { message } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import circleCheck from '@/image/check circle.svg'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import {
  useGetRewardMutation,
  useReceiveMutation,
  useVerifyTranspondMutation,
} from '@/composables/api'
import { TReward } from '@/composables/api/models'
import disposition from '@/composables/disposition'
export default function Congratulations() {
  const [verify, setVerify] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()
  const [rewardData, setRewardData] = useState<TReward>()
  const [context, setContext] = useState<FrameContext>()
  const { mutateAsync: GetReward } = useGetRewardMutation()
  const { mutateAsync: Receive } = useReceiveMutation()
  const { mutateAsync: VerifyTranspond } = useVerifyTranspondMutation()
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
      // console.log(context)
    }
    load()
  }, [])
  const getReward = () => {
    GetReward({ fid: context?.user.fid + '' }).then((res) => {
      if (res.code === 1) {
        setRewardData(res.data)
      }
    })
  }
  useEffect(() => {
    getReward()
  }, [context])
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
      VerifyTranspond({ fid: context.user.fid + '' }).then((res) => {
        setLoading({
          ...loading,
          recastLoading: false,
        })
        if (res.message == 'Cast OK') {
          setVerify(true)
          messageApi.success('Recast Successfully')
        } else {
          sdk.actions.openUrl(disposition.openUrl)
        }
      })
    }
  }
  const sumbit = () => {
    if (!verify) {
      messageApi.warning('Please Recast')
    } else if (rewardData?.status !== 2) {
      messageApi.info('To be reviewed')
      return
    } else {
      if (context && context?.user.fid) {
        Receive({
          fid: context?.user.fid + '',
        }).then((res) => {
          if (res.code === 1) {
            messageApi.open({
              type: 'success',
              content: 'Receive successfully',
            })
            router.push('/rank')
          } else if (res.msg == 'The current user cannot claim it') {
            messageApi.open({
              type: 'info',
              content: 'You already picked it up',
            })
            router.push('/rank')
          }
        })
      } else {
        messageApi.open({
          type: 'warning',
          content: 'please connect wallet',
        })
      }
    }
  }
  return (
    <>
      <>{contextHolder}</>
      <div className="px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="text-2xl text-black in text-center font-bold">Congratulations</div>
          {rewardData && (
            <div className="text-center font-size-[12px] my-2 text-[#999] text-sm">
              <p>You&apos;ve earned</p>
              <p className="my-4 text-3xl font-bold text-[#77BB69]">
                {rewardData.money} GAS
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-6 justify-center items-center ">
          <Button
            isLoading={loading.recastLoading}
            onClick={recast}
            isDefault={true}
            style={{ backgroundColor: verify ? '#E3D4F6' : '#DCC1FE' }}
            className='text-white'
          >
            <div className='flex items-center justify-center gap-2'>
              {verify && (<img src={circleCheck.src} alt="check" />)} Recast
            </div>
          </Button>
          <Button style={{ backgroundColor: verify ? '#77BB69' : '#A0A0A0' }} isLoading={loading.sumbitLoading} onClick={sumbit}>
            Claim
          </Button>
          <p className='font-[12px] text-[#9E9E9E]'>You have to recast first.</p>
        </div>
        {rewardData?.status === 3 && (
          <div className="text-xs font-bold text-center text-[#999] mt-3">
            Waiting for release
          </div>
        )}
      </div>
    </>
  )
}
