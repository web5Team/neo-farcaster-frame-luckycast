'use client'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import banner from '@/image/WechatIMG263.jpg'
import { useGetRewardMutation } from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { useEffect, useState } from 'react'
import Common from '@/components/ui/common'
import { message } from 'antd'
export default function Wait() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
          router.push('/congratulations')
        } else if (res.data.status === 1) {
          messageApi.info('To be reviewed')
        }
      }
    })
  }
  return (
    <>
      <Common src={banner.src}>
        <>{contextHolder}</>
        <div className="px-10 py-28 flex justify-center items-center gap-2 flex-col">
          {/* <Spin className='text-base font-bold' tip="wait..."></Spin> */}
          <Button
            isLoading={loading}
            onClick={recast}
            className="px-16 max-md:px-10"
          >
            Waiting for Airdrop
          </Button>
        </div>
      </Common>
    </>
  )
}
