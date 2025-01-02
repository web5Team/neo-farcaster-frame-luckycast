import { useEffect } from 'react'
import { config } from './WagmiProvider'
import { Neox } from './Neox'

const ConnectToDefault = () => {
  useEffect(() => {
    const connector = config.connectors[0] // 获取第一个连接器
    if (connector) {
      connector
        .connect({
          chainId: Neox.id, // 指定默认链 ID
        })
        .catch((error) => {
          console.error('连接到默认链失败:', error)
        })
    }
  }, [config])

  return null
}
export default ConnectToDefault