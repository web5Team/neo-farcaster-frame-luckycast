'use client'

import React, { useRef } from 'react'
// import sdk, { FrameContext } from '@farcaster/frame-sdk'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Input, message, Spin } from 'antd'
import { LoadingOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import Common from '@/components/ui/common'
import { Button } from '@/components/ui/Button'
import banner from '@/image/BgHeader.png'
import avatar from '@/image/avatar.png'
import help from '@/image/HELP_.png'
import circleCheck from '@/image/check circle.svg'
import {
  useGetRewardMutation,
  useSumbitDataMutation,
  useVerifyTeamcode,
  useVerifyTranspondMutation,
} from '@/composables/api'
import sdk, { FrameContext } from '@farcaster/frame-sdk'
import disposition from '@/composables/disposition'
import AccountUrlDisplayer from '@/components/ui/AccountUrlDisplayer'
import './user-style.css'
import InfoDialog from '@/components/ui/InfoDialog'
import Wait from '../../components/WaitAirDrop'
import { createPortal } from 'react-dom'
import { useOnClickOutside } from 'usehooks-ts'
import DisconnectButton from '@/components/ui/DisconnectButton'

export default function UserAddress() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [context, setContext] = useState<FrameContext>()
  const { disconnect } = useDisconnect()

  const [teamCode, setTeamCode] = useState('')
  const [verify, setVerify] = useState(false)
  const [done, setDone] = useState(false)
  const [userInfo, setUserInfo] = useState({
    picUrl: '',
    displayName: '',
    fid: -1,
    username: '',
  })
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: SumbitData } = useSumbitDataMutation()
  const { mutateAsync: VerifyTranspond } = useVerifyTranspondMutation(
    disposition.first.verifyUrl
  )
  const { mutateAsync: rewardMutation } = useGetRewardMutation()
  const { mutateAsync: verifyTeamCode } = useVerifyTeamcode()

  async function trySignIn() {
    const nonce = [...((address?.substring(0, 8) || '') + Date.now())]
      .reverse()
      .join('')

    try {
      const res = await sdk.actions.signIn({ nonce })
      console.log('context', res)

      handleSigned()
    } catch (e) {
      messageApi.warning('Please signin to continue')

      trySignIn()

      console.log(e)
    }
  }

  async function handleSigned() {
    const res = (await sdk.context).user

    if (!res.username) {
      trySignIn()
      return
    }

    setUserInfo({
      fid: res.fid,
      username: res.username,
      displayName: res.displayName || '',
      picUrl: res.pfpUrl || avatar.src,
    })

    setTimeout(() => {
      setGlobalLoading(true)
    }, 100)
    console.log('ready to verify')

    const rewardRes = await rewardMutation({
      fid: res.fid + '',
      address: address + '',
    })

    if (rewardRes.code === 0 && rewardRes.msg === 'reward does not exist') {
      // new user - no action
      setTimeout(() => {
        setGlobalLoading(false)
      }, 100)
      return
    }

    VerifyTranspond({ fid: res.fid + '' }).then(() => {
      console.log('VerifyTranspond')
      setVerify(true)

      SumbitData({
        fid: res.fid + '',
        nickname: res.username || '',
        email: '',
        address: address + '',
        team_code: teamCode.trim(),
      }).then((res) => {
        if (res.code === 1) {
          setDone(true)
        } else if (res.msg == 'The current data has been submitted') {
          setDone(true)
        }

        setTimeout(() => {
          setGlobalLoading(false)
        }, 100)
      }).catch(() => {
        setTimeout(() => {
          setGlobalLoading(false)
        }, 100)
      })
    }).catch(() => {
      setTimeout(() => {
        setGlobalLoading(false)
      }, 100)
    })
  }

  useEffect(() => {
    if (isConnected) {

      setTimeout(async () => {
        handleSigned()
      })
    } else {
      messageApi.error('Please connect your wallet first.')
      router.push('/')
    }
  }, [isConnected, address])

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context)
    }
    load()
  }, [])

  const [verifyStatus, setVerifyStatus] = useState(0) // 0 for normal, 1 for true, 2 for failed

  const [globalLoading, setGlobalLoading] = useState(false)
  const [loading, setLoading] = useState({
    recastLoading: false,
    sumbitLoading: false,
  })
  const [recastClicked, setRecastClicked] = useState(false)
  let lastClickTime = -1
  const recast = async () => {
    if (verifyStatus === 2) {
      messageApi.error('Please input correct team code')
      return
    }

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
          setRecastClicked(true)
          sdk.actions.openUrl(disposition.first.openUrl)
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

    if (verifyStatus === 2) {
      messageApi.error('Please input correct team code')
      return
    }

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

  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClickOutside = () => {
    setIsVisible(false)
  };
  // @ts-expect-error nextline
  useOnClickOutside(wrapperRef, handleClickOutside);
  const [showOpen, setShowOpen] = useState(false)

  // a useDocumentVisible hook
  const useDocumentVisible = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const handler = () => {
        setVisible(!document.hidden);

        if (visible) {
          recast()
        }
      };

      document.addEventListener('visibilitychange', handler);

      return () => {
        document.removeEventListener('visibilitychange', handler);
      };
    }, []);

    return visible;
  }

  const [verifyCodeLoading, setVerifyCodeLoading] = useState(false)
  const verifyCode = async () => {
    if (!teamCode?.length) return

    setVerifyCodeLoading(true)

    const { data } = await verifyTeamCode({
      team_code: teamCode.trim(),
    })

    setVerifyCodeLoading(false)

    setVerifyStatus(data.is_check ? 1 : 2)
  }

  useDocumentVisible()

  return (
    <>
      <Common className="bg-[#EFFDEC]" src={banner.src}>
        <div onClick={() => setIsVisible(true)} className="UserPage-Displayer">
          <AccountUrlDisplayer text={address || ''} />
        </div>
        <div ref={wrapperRef} style={{ display: isVisible ? '' : 'none' }} className="UserPage-Disconnection">
          <DisconnectButton />
          {/* <Button>Disconnect</Button> */}
        </div>

        <div className="UserPage-Avatar z-10">
          <img src={avatar.src} alt="Avatar" />
        </div>
        <>{contextHolder}</>

        <div className="relative bg-[#F7FBFA]  mt-[-25%] page-content pb-6">
          <div
            onClick={() => setShowOpen(true)}
            className="absolute text-sm text-[#999] hover:text-[#7866bb] transition-all right-2 top-2 mt-2 mr-2 cursor-pointer"
          >
            <img src={help.src} alt="HELP" />
          </div>

          <div className="pt-20 text-[24px] text-black mx-8 font-bold">
            <p>@{userInfo.username}</p>
          </div>

          <div className="flex items-center pt-10  px-6 gap-1.5 text-base">
            <div className="max-md:text-[14px] font-bold mx-1 text-[#727a81]">
              Team Code
            </div>
            <Input
              value={teamCode}
              className="w-[150px] rounded-1xl py-2"
              style={{ color: verifyStatus === 2 ? '#FF4D4F' : '', border: verifyStatus === 2 ? '1px solid #FF4D4F' : ''}}
              onChange={(e) => {
                setTeamCode(e.target.value)

                if (!e.target.value?.length) {
                  setVerifyStatus(0)
                }
              }}
              placeholder="Optional"
              variant="filled"
              onBlur={verifyCode}
            />
            {
              verifyCodeLoading && (<Spin className='mx-2' indicator={<LoadingOutlined spin />} />) 
            }
            {
              verifyStatus === 1 && (<span className='color-[#7EBE71]'><CheckOutlined /></span>)
            }
            {
              verifyStatus === 2 && (<span className='text-[#FF4D4F]'>Unavailable</span>)
            }
          </div>

          {/* <Modal open={showOpen} onOk={() => setShowOpen(false)} onCancel={() => setShowOpen(false)}>
            <div>this is a help session.</div>
          </Modal> */}

          {done &&
            createPortal(
              <div className="UserPage-Wait">
                <Wait />
              </div>,
              document.body
            )}

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

        <div className="mt-5 mx-auto w-[80%] text-base flex flex-col justify-center items-center gap-6">
          <Button
            isLoading={loading.recastLoading}
            isDefault={true}
            onClick={recast}
            style={{ backgroundColor: verify ? '#E3D4F6' : '#DCC1FE' }}
            className={'text-white'}
          >
            <div className="flex items-center justify-center gap-2">
              {(!verify && recastClicked) && (
                <span>Refresh</span>
              )}
              {
                (verify || !recastClicked) && (
                  <>
                    {verify && <img src={circleCheck.src} alt="check" />} Recast
                  </>
                )
              }
            </div>
          </Button>
          <Button
            style={{ backgroundColor: verify ? '#77BB69' : '#A0A0A0' }}
            className=""
            isLoading={loading.sumbitLoading}
            onClick={sumbit}
          >
            Submit
          </Button>
          <p className="-mt-4 font-[12px] text-[#9E9E9E]">
            You have to recast first.
          </p>
        </div>

        {
          createPortal((
            <div className='transition-all absolute flex justify-center items-center top-0 left-0 w-full h-full bg-white' style={{ zIndex: '1000', opacity: globalLoading ? '1' : '0', pointerEvents: !globalLoading ? 'none' : 'auto' }}>
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ), document.body)
        }

      </Common>
    </>
  )
}
