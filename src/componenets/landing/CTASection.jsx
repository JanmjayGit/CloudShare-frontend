import React from 'react'

const CTASection = ({openSignUp}) => {
  return (
    <div className='dark-cta-section'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between'>
        <h2 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
          <span className='block'>Ready to get started?</span>
          <span className='block' style={{color:'rgba(196,181,253,0.9)'}}>Create your account today.</span>
        </h2>
        <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
          <div className='inline-flex rounded-md shadow'>
            <button 
              onClick={() => openSignUp()}
              className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md transition-colors duration-200'
              style={{color:'var(--accent-600)', background:'#fff'}}
              onMouseOver={e => e.currentTarget.style.background='rgba(245,243,255,1)'}
              onMouseOut={e => e.currentTarget.style.background='#fff'}
            >
              Sign Up for free
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CTASection