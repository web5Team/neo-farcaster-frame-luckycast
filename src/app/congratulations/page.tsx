'use client'
import { Button } from '@/components/ui/Button'
import Common from '@/components/ui/common'
import { message } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import banner from '@/image/WechatIMG263.jpg'
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
    <Common src={banner.src}>
      <>{contextHolder}</>
      <div className="px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="text-2xl text-black in">Congratulations</div>
          {rewardData && (
            <div className="mt-[5px] text-[#999] text-sm">
              <span>You will get </span>
              <span className="font-bold">
                {rewardData.money} Gas
              </span>
            </div>
          )}
        </div>
        <div className="mt-24 flex gap-6 justify-center items-center ">
          <Button
            isLoading={loading.recastLoading}
            onClick={recast}
            isDefault={true}
          >
            Recast
          </Button>
          <Button isLoading={loading.sumbitLoading} onClick={sumbit}>
            Claim
          </Button>
        </div>
        {rewardData?.status === 3 && (
          <div className="text-xs font-bold text-center text-[#999] mt-3">
            Waiting for release
          </div>
        )}
      </div>
    </Common>
  )
}
