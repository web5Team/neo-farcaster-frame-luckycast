'use client'
import Common from '@/components/ui/common'
import banner from '@/image/BgHeader.png'
import avatar from '@/image/avatar.png'
import avatar2 from '@/image/avatar-2.png'
import './index.css'
import { useEffect, useRef, useState } from 'react'
import {
  useFarcasterRankMutation,
  useGetRewardMutation,
} from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { TRank, TReward } from '@/composables/api/models'
import { useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import AccountUrlDisplayer from '@/components/ui/AccountUrlDisplayer'
import InfoDialog from '@/components/ui/InfoDialog'
import help from '@/image/HELP_.png'
import stroke from '@/image/stroke.svg'
import rankNum from '@/image/rankNum.png'
import { useOnClickOutside } from 'usehooks-ts'

export default function Rank() {
  const router = useRouter()
  const [rankList, setRankList] = useState([] as TRank[])
  const [context, setContext] = useState<FrameContext>()
  const [rewardData, setRewardData] = useState<TReward>()
  const { mutateAsync: FarcasterRank } = useFarcasterRankMutation()
  const { mutateAsync: GetReward } = useGetRewardMutation()
  const { isConnected, address } = useAccount()
  const [userInfo, setUserInfo] = useState({
    picUrl: '',
    displayName: '',
    fid: -1,
    username: '',
  })

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
  }, [isConnected, address])

  const wrapperRef = useRef(null);
  const { disconnect } = useDisconnect()
  const [isVisible, setIsVisible] = useState(false);

  const handleClickOutside = () => {
    setIsVisible(false)
  };
  // @ts-expect-error nextline
  useOnClickOutside([wrapperRef], handleClickOutside);

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, address])

  return (
    <Common src={banner.src} className="">
      <div onClick={() => setIsVisible(true)} className="UserPage-Displayer">
        <AccountUrlDisplayer text={address || ''} />
      </div>
      <div ref={wrapperRef} style={{ display: isVisible ? '' : 'none' }} onClick={() => disconnect()} className="UserPage-Disconnection">
        <button>Disconnect</button>
      </div>

      <div className="UserPage-Avatar z-10">
        <img src={avatar.src} alt="Avatar" />
      </div>

      <div className="relative bg-[#f8fbfa]  mt-[-25%] page-content pb-6">
        <div
          onClick={() => setShowOpen(true)}
          className="absolute text-sm text-[#999] hover:text-[#7866bb] transition-all right-2 top-2 mt-2 mr-2 cursor-pointer"
        >
          <img src={help.src} alt="HELP" />
        </div>

        <div className="pt-20 px-6 flex flex-col gap-[30px] text-[24px] text-black font-bold ">
          <p className="text-[28px]">@{userInfo.username}</p>
          <div className="flex flex-col gap-2">
            <div className="text-xl font-bold  leading-[30px]">
              {rewardData?.balance} GAS
            </div>
            <div className="text-sm text-[#686a6c] flex gap-1 items-center">
              <img src={stroke.src} className="w-3 h-3" alt="" />
              <span className="text-sm leading-6 font-medium">Balance</span>
            </div>
          </div>
        </div>

        {/* <div className="z-10 flex px-4 flex-col gap-2.5 py-4 font-[Krona One] ">
         
        </div> */}

        <InfoDialog
          emoji="🧐"
          closable
          isOpen={showOpen}
          onClose={() => setShowOpen(false)}
        >
          <div className="text-black my-4 text-center">
            <p className="font-bold text-2xl">HELP?</p>
            <ul className="list-disc list-inside text-left text-[#868686]">
              <li>
                <span className="-ml-2">
                  Recast first, then submit your information to claim the
                  airdrop.
                </span>
              </li>
              <li>
                <span className="-ml-2">
                  Join a KOL team using a code to get a multiplier bonus.
                </span>
              </li>
              <li>
                <span className="-ml-2">
                  Each FID can only be bound to one valid address to receive
                  airdrops.
                </span>
              </li>
              <li>
                <span className="-ml-2">
                  Stay tuned for more airdrops from Neo in the future.
                </span>
              </li>
            </ul>
          </div>
        </InfoDialog>
      </div>

      <div className="bg-[#f2fded] text-black pb-48">
        <div className=" px-6 text-base leading-[30px] pt-6 font-bold">Leaderboard</div>
        <div className="flex flex-col justify-center mt-6 gap-[12px] pb-[40px]">
          {rankList.map((item, index) => (
            <div
              key={index}
              className={`p-6 flex items-center gap-6 border-b border-[#e1e2e2]`}
            >
              <div className={`w-10 h-10 relative rank flex justify-center items-center font-[bold]`}>
                <span className=' relative z-10 text-base font-bold'>{index + 1}</span>
                <img src={rankNum.src} className='w-[58px] h-[58px] max-w-none absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-[35%]' alt="" />
              </div>
              <div className={`flex items-center gap-4`}>
                <img src={avatar2.src} className='w-20 h-20' alt="" />
                <div className='flex flex-col gap-1'>
                  <div className="text-2xl font-bold ">
                    {item.name}
                  </div>
                  <div className="text-base font-bold">
                    <span className='text-[#686a6c]'>Total earn </span>
                    <span className='ml-1'> {item.number} GAS</span>
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
