import { Metadata } from 'next'
import App from './app'

const frame = {
  version: 'next',
  imageUrl: 'https://pic1.imgdb.cn/item/6773988bd0e0a243d4ed04cc.png',
  button: {
    title: 'LuckyCast',
    action: {
      type: 'launch_frame',
      name: 'LuckyCast',
      url:
        process.env.NODE_ENV === 'development'
          ? 'https://pagedev.tagzxia.com/'
          : 'https://www.luckycast.xyz/',
      splashImageUrl: `https://frames-v2.vercel.app/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'LuckyCast',
    openGraph: {
      title: 'LuckyCast',
      description: 'A LuckyCast.',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
