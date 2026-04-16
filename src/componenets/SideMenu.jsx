import { useUser } from '@clerk/clerk-react'
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react'
import { SIDE_MENU_DATA } from '../assets/data';

const SideMenu = ({activeMenu}) => {

    const{user} = useUser();
    const navigate = useNavigate();

  return (
    <div className='dark-sidebar w-64 h-[calc(100vh-61px)] p-5 sticky top-[61px] z-20'>
        <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
            {user ?. imageUrl ? (
                <img src={user?.imageUrl || ""} alt="Profile image" className='w-20 h-20 rounded-full ring-2 ring-violet-500/50 ring-offset-2 ring-offset-transparent'/>
            ):(
                <User className='w-20 h-20' style={{color:'var(--text-muted)'}}/>
            )}
        </div>

        <h5 className='flex items-center justify-center font-semibold leading-6 mb-6' style={{color:'var(--text-primary)'}}>
            {user?.fullName || ""}
        </h5>

        {/* side menu options */}
        {SIDE_MENU_DATA.map((item, index) => (
            <button
                onClick={() => navigate(item.path)}
                key={`menu_${index}`}
                className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer ${activeMenu === item.label ? 'sidebar-active-item' : 'sidebar-inactive-item'}`}
            >
               <item.icon className='text-xl'/> 
               {item.label}
            </button>
        ))}
    </div>
  )
}

export default SideMenu;