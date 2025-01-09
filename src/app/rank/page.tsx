'use client'
import Common from '@/components/ui/common'
import banner from '@/image/BgHeader.png'
import avatar from '@/image/avatar.png'
import './index.css'
import { useEffect, useState } from 'react'
import {
  useFarcasterRankMutation,
  useGetRewardMutation,
} from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { TRank, TReward } from '@/composables/api/models'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import AccountUrlDisplayer from '@/components/ui/AccountUrlDisplayer'
import InfoDialog from '@/components/ui/InfoDialog'
import help from '@/image/HELP_.png'

export default function Rank() {
  const router = useRouter()
  const [rankList, setRankList] = useState([] as TRank[])
  const [context, setContext] = useState<FrameContext>()
  const [rewardData, setRewardData] = useState<TReward>()
  const { mutateAsync: FarcasterRank } = useFarcasterRankMutation()
  const { mutateAsync: GetReward } = useGetRewardMutation()
  const { isConnected, address } = useAccount()
  const [userInfo, setUserInfo] = useState({ picUrl: '', displayName: '', fid: -1, username: '' })

  const [showOpen, setShowOpen] = useState(false)

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

  useEffect(() => {
    if (isConnected) {
      setTimeout(async () => {
        const res = (await sdk.context).user

        if (res.username) {
          setUserInfo({
            fid: res.fid,
            username: res.username,
            displayName: res.displayName || '',
            picUrl: res.pfpUrl || avatar.src,
          })
        }

      })
    } else {
      router.push('/')
    }
  }, [isConnected, address]);

  return (
    <Common src={banner.src} className="">
      <div className="UserPage-Displayer">
        <AccountUrlDisplayer text={address || ''} />
      </div>

      <div className='UserPage-Avatar z-10'>
        <img src={userInfo.picUrl} alt="Avatar" />
      </div>

      <div className="relative bg-[#F7FBFA]  mt-[-25%] page-content pb-6">
        <div onClick={() => setShowOpen(true)} className="absolute text-sm text-[#999] hover:text-[#7866bb] transition-all right-2 top-2 mt-2 mr-2 cursor-pointer">
          <img src={help.src} alt="HELP" />
        </div>

        <div className='pt-20 text-[24px] text-black mx-8 font-bold'>
          <p>@{userInfo.username}</p>
        </div>

        <div className="z-10 flex px-4 flex-col gap-2.5 py-4 bg-white  ">
          <div className="text-2xl font-bold">
            {rewardData?.balance} {rewardData?.balance_unit}GAS
          </div>
          <div className="text-sm text-[#999]">Balance</div>
        </div>

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

      <div className="h-full">
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
