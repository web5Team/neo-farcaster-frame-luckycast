import { Button } from 'antd';
import React from 'react';
import { useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation'
import { LoadingOutlined } from '@ant-design/icons';

const DisconnectButton: React.FC = () => {
  const router = useRouter()
  const { disconnect } = useDisconnect()

  const [loading, setLoading] = React.useState(false)

  function handleClick() {
    setLoading(true)

    disconnect(undefined, {
      onSuccess() {
        router.push('/')
      },
      onError() {
        location.reload()
      }
    })
  }

  if (loading) 
    return <LoadingOutlined spin />

  return <button className='' onClick={handleClick}>Disconnect</button>
};

export default DisconnectButton;

