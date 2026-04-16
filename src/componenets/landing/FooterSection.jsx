import React from 'react'

const FooterSection = () => {
  return (
    <footer className='dark-footer'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <p className='text-base' style={{color:'var(--text-muted)'}}>
            &copy; {new Date().getFullYear()} CloudShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection