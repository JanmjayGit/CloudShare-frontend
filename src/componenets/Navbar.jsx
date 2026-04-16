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
    <div className='dark-navbar flex items-center justify-between gap-5 py-4 px-4 sm:px-7 sticky top-0 z-30'>
        {/* left side with menu button with title */}
        <div className='flex items-center gap-5'>
            <button
                onClick={() => setOpenSidemenu(!openSidemenu)} 
                className='dark-menu-btn block lg:hidden p-1'>
                {openSidemenu ?(
                    <X className="text-2xl" />
                ) : (
                    <Menu className="text-2xl"/>
                )}
            </button>
            <div className='flex items-center gap-2'>
                <Share2 className='text-2xl text-violet-400'/>
                <span className='font-bold text-lg truncate' style={{color:'var(--text-primary)'}}>CloudShare</span>
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
            <div className='dark-mobile-sidebar fixed top-[73px] left-0 right-0 lg:hidden z-20'>
               <SideMenu activeMenu={activeMenu}/>
            </div>
        )}
    </div>
  )
}

export default Navbar