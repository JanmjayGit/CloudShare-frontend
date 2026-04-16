import React from 'react'
import dashboard_image from '../../assets/dashboard_image.png'
import image from '../../assets/image.png'

const HeroSection = ({ openSignIn, openSignUp }) => {
    return (
        <div className='landing-page-content relative'>
            <div className='absolute inset-0 hero-overlay z-0 pointer-events-none'></div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28'>
                    <div className='text-center'>
                        <h1 className='text-4xl tracking-tight font-extrabold sm:text-5xl' style={{ color: 'var(--text-primary)' }}>
                            <span className='block'>Share Files Securely with </span>
                            <span className='block text-violet-400'>CloudeShare</span>
                        </h1>
                        <p className='mt-3 max-w-20 mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl' style={{ color: 'var(--text-secondary)' }}>
                            Upload, manage, and share your files securely. Access them from anywhere, anytime.
                        </p>
                        <div className='mt-10 max-w-sm max-auto sm:max-w-none sm:flex sm:justify-center'>
                            <div className='space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5'>
                                <button
                                    onClick={() => openSignUp()}
                                    className='btn-primary flex items-center px-6 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10'>
                                    Get Started
                                </button>
                                <button
                                    onClick={() => openSignIn()}
                                    className='btn-secondary flex items-center justify-center px-6 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10'>
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='relatave'>
                    <div className='aspect-w-16 rounded-xl overflow-hidden' style={{ border: '1px solid var(--border-default)', boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.12)' }}>
                        <img src={image} alt="cloudshare dashboard" className='w-full h-full object-cover' />
                    </div>
                </div>
                <div className='mt-8 text-center pb-16'>
                    <p className='mt-4 text-base' style={{ color: 'var(--text-muted)' }}>
                        All your files are encrypted and stored securely with enterprise-grade security protocols.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;