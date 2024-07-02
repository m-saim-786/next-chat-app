import { Suspense } from 'react'
import Conversations from '@/components/chat/Conversations'

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex w-full h-full">
        <Suspense fallback={<div>Loading ...</div>}>
          <Conversations />
          {children}
        </Suspense>
      </div>
    </>
  )
}

export default layout
