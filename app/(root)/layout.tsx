'use client'
import SidebarWrapper from '@/components/navbar/SidebarWrapper'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {

  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect('/signIn')
  }

  return <SidebarWrapper>{children}</SidebarWrapper>
}

export default Layout
