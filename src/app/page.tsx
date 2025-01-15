import { Metadata } from 'next'
import App from './app'

const frame = {
  version: 'next',
  imageUrl: 'https://pic1.imgdb.cn/item/6780cb98d0e0a243d4f2fda7.png',
  button: {
    title: 'LuckyCast',
    action: {
      type: 'launch_frame',
      name: 'LuckyCast',
      url:
        process.env.NODE_ENV === 'development'
          ? 'https://9067-46-232-123-33.ngrok-free.app'
          : 'https://www.luckycast.xyz/',
      splashImageUrl: `https://pic1.imgdb.cn/item/6780cb95d0e0a243d4f2fda4.png`,
      splashBackgroundColor: '#f2fded',
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
