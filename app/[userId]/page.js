import EmptyPage from '@/components/conversationComponents/EmptyPage'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  return (
    <div className="hidden sm:block sm:pl-80 h-full">
      <EmptyPage/>
    </div>
  )
}

export default Page