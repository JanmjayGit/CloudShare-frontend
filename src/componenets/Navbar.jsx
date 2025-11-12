import { UserButton } from '@clerk/clerk-react';
import { X, Menu, Share2, Wallet} from 'lucide-react';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import SideMenu from './SideMenu';
import CreditsDisplay from './CreditsDisplay';
import { UserCreditsContext } from '../context/UserCreditsContext';


const Navbar = ({activeMenu}) => {

    const[openSidemenu, setOpenSidemenu] = useState(false);
    const {credits, fetchUserCredits} = useContext(UserCreditsContext);

    useEffect(() => {
        fetchUserCredits();
    },[fetchUserCredits]);

  return (
    <div className='flex items-center justify-between gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30'>
        {/* left side with menu button with title */}
        <div className='flex items-center gap-5'>
            <button
                onClick={() => setOpenSidemenu(!openSidemenu)} 
                className='block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors'>
                {openSidemenu ?(
                    <X className="text-2xl" />
                ) : (
                    <Menu className="text-2xl"/>
                )}
            </button>
            <div className='flex items-center gap-2'>
                <Share2 className='text-2xl text-blue-600'/>
                <span className='font-medium text-lg text-black truncate'>CloudShare</span>
            </div>
        </div>
        {/* right side with user button and credits */}
        <SignedIn>
            <div className='flex items-center gap-4'>
                <Link to="/subscriptions">
                    <CreditsDisplay credits={credits}/>
                </Link>
                <div className='relative'>
                    <UserButton />
                </div>
            </div>
        </SignedIn>
        {/* mobile sidemenu */}

        {openSidemenu && (
            <div className='fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20'>
               <SideMenu activeMenu={activeMenu}/>
            </div>
        )}
    </div>
  )
}

export default Navbar