'use client'
import { Button } from '@/components/ui/Button'
import { message } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import circleCheck from '@/image/check circle.svg'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import {
  useGetRewardMutation,
  useReceiveMutation,
  useVerifyTranspondMutation,
} from '@/composables/api'
import { TReward } from '@/composables/api/models'
import disposition from '@/composables/disposition'
import { createPortal } from 'react-dom'
import { useAccount, useDisconnect } from 'wagmi'
import AccountUrlDisplayer from './ui/AccountUrlDisplayer'
import { useOnClickOutside } from 'usehooks-ts'
import DisconnectButton from './ui/DisconnectButton'

export default function Congratulations() {
  const [verify, setVerify] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  const [recastClicked, setRecastClicked] = useState(false)
  const [rewardData, setRewardData] = useState<TReward>()
  const [context, setContext] = useState<FrameContext>()
  const { mutateAsync: GetReward } = useGetRewardMutation()
  const { mutateAsync: Receive } = useReceiveMutation()
  const { mutateAsync: VerifyTranspond } = useVerifyTranspondMutation(
    disposition.second.verifyUrl
  )
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
      // console.log(context)

      // VerifyTranspond({ fid: (await sdk.context).user.fid + '' }).then(
      //   (res) => {
      //     if (res.message == 'Cast OK') {
      //       setVerify(true)
      //     }
      //   },
      //   () => {
      //     sdk.actions.openUrl(disposition.second.openUrl)
      //   }
      // )
    }
    load()
  }, [])
  const getReward = () => {
    GetReward({
      fid: context?.user.fid + '',
      address: address || '',
    }).then((res) => {
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
      VerifyTranspond({ fid: context.user.fid + '' })
        .then(
          (res) => {
            if (res.message == 'Cast OK') {
              setVerify(true)
              messageApi.success('Recast Successfully')
            }
          },
          () => {
            setRecastClicked(true)
            sdk.actions.openUrl(disposition.second.openUrl)
          }
        )
        .finally(() =>
          setLoading({
            ...loading,
            recastLoading: false,
          })
        )
    }
  }

  let lastClickTime = -1

  const sumbit = () => {
    if (loading.sumbitLoading) return

    if (!verify) {
      messageApi.warning('Please Recast')
    } else if (rewardData?.status == 1) {
      messageApi.info('To be reviewed')
      return
    } else if (rewardData?.status == 3) {
      router.push('/rank')
    } else if (rewardData?.status === 2) {
      if (Date.now() - lastClickTime <= 10000) {
        messageApi.warning('Please wait 10 seconds.')
        return
      }

      lastClickTime = Date.now()

      if (context && context?.user.fid) {
        setLoading({
          ...loading,
          sumbitLoading: true,
        })
        Receive({
          fid: context?.user.fid + '',
          address: address || '',
        })
          .then(
            (res) => {
              if (res.code === 1) {
                messageApi.open({
                  type: 'success',
                  content: 'Receive successfully',
                })
                setVerify(false)
                router.push('/rank')
              } else if (res.msg == 'The current user cannot claim it') {
                messageApi.open({
                  type: 'info',
                  content: 'You already picked it up',
                })
                router.push('/rank')
              } else if (
                res.msg == 'The network is abnormal, please try again later.'
              ) {
                messageApi.open({
                  type: 'warning',
                  content: 'The network is abnormal, please try again later.',
                })
              }
            },
            (res) => {
              messageApi.open({
                type: 'warning',
                content: typeof res ==='string' ?res: 'The network is abnormal, please try again later.',
              })
            },
          )
          .finally(() =>
            setLoading({
              ...loading,
              sumbitLoading: false,
            })
          )
      } else {
        messageApi.open({
          type: 'warning',
          content: 'please connect wallet',
        })
      }
    }
  }

  const { disconnect } = useDisconnect()
  const wrapperRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const { address } = useAccount()
  const handleClickOutside = () => {
    setIsVisible(false)
  }
  // @ts-expect-error nextline
  useOnClickOutside(wrapperRef, handleClickOutside)

  return (
    <>
      <>{contextHolder}</>
      {createPortal(
        <div className="WaitPage-Header">
          <div
            onClick={() => setIsVisible(true)}
            className="WaitPage-Displayer"
          >
            <AccountUrlDisplayer text={address || ''} />
          </div>
          <div
            ref={wrapperRef}
            style={{ display: isVisible ? '' : 'none' }}
            className="UserPage-Disconnection z-1"
          >
            <DisconnectButton />
            {/* <button>Disconnect</button> */}
          </div>
        </div>,
        document.body
      )}
      <div className="px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="text-2xl text-black in text-center font-bold">
            Congratulations
          </div>
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
            className="text-white"
          >
            <div className="flex items-center justify-center gap-2">
              {!verify && recastClicked && <span>Refresh</span>}
              {(verify || !recastClicked) && (
                <>
                  {verify && <img src={circleCheck.src} alt="check" />} Recast
                </>
              )}
            </div>
          </Button>
          <Button
            style={{ backgroundColor: verify ? '#77BB69' : '#A0A0A0' }}
            isLoading={loading.sumbitLoading}
            onClick={sumbit}
          >
            Claim
          </Button>
          {!verify && (
            <p className="-mt-4 font-[12px] text-[#9E9E9E]">
              You have to recast first.
            </p>
          )}
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
