'use client'
import Common from '@/components/ui/common'
import banner from '@/image/WechatIMG263.jpg'
import './index.css'
import { useEffect, useState } from 'react'
import {
  useFarcasterRankMutation,
  useGetRewardMutation,
} from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { TRank, TReward } from '@/composables/api/models'
export default function Rank() {
  const [rankList, setRankList] = useState([] as TRank[])
  const [context, setContext] = useState<FrameContext>()
  const [rewardData, setRewardData] = useState<TReward>()
  const { mutateAsync: FarcasterRank } = useFarcasterRankMutation()
  const { mutateAsync: GetReward } = useGetRewardMutation()
  const getRankList = () => {
    FarcasterRank({ fid: context?.user.fid + '' || '' }).then((res) => {
      if (res.code === 1) {
        setRankList(res.data)
      }
    })
  }
  const getReward = () => {
    GetReward({ fid: context?.user.fid + '' }).then((res) => {
      if (res.code === 1) {
        setRewardData(res.data)
      }
    })
  }
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
    }
    load()
  }, [])
  useEffect(() => {
    if (context) {
      getRankList()
      getReward()
    }
  }, [context])
  return (
    <Common src={banner.src} className="">
      <div className="h-full">
        <div className=" sticky top-0 left-0 z-10 flex justify-center items-center flex-col gap-2.5 py-4 bg-white  ">
          <div className="text-3xl font-bold">Balance</div>
          <div className="text-sm text-[#999]">
            {rewardData?.balance} {rewardData?.balance_unit}GAS
          </div>
        </div>
        <div className="flex flex-col justify-center gap-[12px]  mt-0 pb-[40px] px-[20px]">
          {rankList.map((item, index) => (
            <div
              key={index}
              className={` relative flex rank-item w-full  justify-between items-center py-2 overflow-hidden shadow-md rank-item-${
                index + 1
              }`}
            >
              <div className={`flex items-start gap-4`}>
                <div className={`rank-${index + 1} rank font-bold]`}>
                  {index + 1}
                </div>
                <div>
                  <div className="text-base leading-[16px] ">
                    team code:
                    <span className="font-bold"> {item.team_code}</span>
                  </div>
                  <div className="mt-1">
                    <span>
                      sumbit num:
                      <span className="font-bold"> {item.number}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Common>
  )
}
