import React from 'react'
import { useUser } from '@clerk/clerk-react'
import Navbar from '../componenets/Navbar';
import SideMenu from '../componenets/SideMenu';

const DashboardLayout = ({children, activeMenu}) => {

    const {user} = useUser();

  return (
    <div>
        {/* Navbar componenet */}
        <Navbar activeMenu={activeMenu} />
        {user && (
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    {/* Side menubar component */}
                    <SideMenu activeMenu={activeMenu} />
                </div>
                <div className='grow mx-5'>{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout