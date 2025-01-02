import Image from 'next/image'
import React, { Suspense } from 'react'
interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  src?: string
  head?: React.ReactNode
}

export default function Common({ children, src, head, ...props }: DivProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main
        className={`h-screen max-md:w-full  flex justify-center max-md:items-start bg-white`}
      >
        <div
          className={`max-md:w-full  w-[400px] h-full flex flex-col ${props.className}`}
        >
          {head ||
            (src && (
              <div className="title text-center text-xl  font-bold  shadow-sm bg-white">
                <Image
                  className="w-full h-full"
                  width={300}
                  height={500}
                  src={src || ''}
                  alt=""
                />
              </div>
            ))}
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </Suspense>
  )
}
