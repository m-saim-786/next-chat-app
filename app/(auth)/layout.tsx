'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return redirect('/')
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {children}
    </div>
  )
}

export default Layout
