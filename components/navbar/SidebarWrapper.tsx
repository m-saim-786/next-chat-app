import React from 'react'
import Sidebar from './Sidebar'

type SidebarWrapperProps = React.PropsWithChildren<Record<string, any>>;

const SidebarWrapper = ({ children }: SidebarWrapperProps) => {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="w-full h-full">{children}</div>
    </div>
  )
}

export default SidebarWrapper
