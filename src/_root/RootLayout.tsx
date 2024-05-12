import BottomBar from '@/components/ui/shared/Bottombar'
import LeftSidebar from '@/components/ui/shared/LeftSidebar'
import Topbar from '@/components/ui/shared/Topbar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar/>
      <LeftSidebar/>
      
      <section className='flex flex-1 h-full'>
        <Outlet/>
      </section>

      <BottomBar/>
    </div>
  )
}

export default RootLayout