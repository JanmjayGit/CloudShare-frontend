import { useUser } from '@clerk/clerk-react'
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react'
import { SIDE_MENU_DATA } from '../assets/data';

const SideMenu = ({activeMenu}) => {

    const{user} = useUser();
    const navigate = useNavigate();

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>
        <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
            {user ?. imageUrl ? (
                <img src={user?.imageUrl || ""} alt="Profile image" className='w-20 h-20 bg-slate-400 rounded-full'/>
            ):(
                <User className='w-20 h-20 text-xl'/>
            )}
        </div>

        <h5 className='flex items-center justify-center text-gray-950 font-medium leading-6 mb-6'>
            {user?.fullName || ""}
        </h5>

        {/* side menu options */}
        {SIDE_MENU_DATA.map((item, index) => (
            <button
                onClick={() => navigate(item.path)}
                key={`menu_${index}`}
                className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all duration-200 curser-pointer ${activeMenu === item.label ? 'bg-purple-500 font-medium text-white shadow-md hover:bg-purple-600' : 'hover:bg-gray-200'}`}
            >
               <item.icon className='text-xl'/> 
               {item.label}
            </button>
        ))}
    </div>
  )
}

export default SideMenu;