import { CreditCard } from 'lucide-react'
import React from 'react'

const CreditsDisplay = ({credits}) => {
    console.log("credits from context:", credits);
    
  return (
   
    <div className='dark-credits-badge'>  
        <CreditCard size={16}/>
        <span className='font-medium'>{credits}</span>
        <span className='text-xs'>Credits</span>
    </div>
  )
}

export default CreditsDisplay