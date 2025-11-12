import React, { useEffect } from 'react'
import HeroSection from '../componenets/landing/HeroSection'
import FeatureSection from '../componenets/landing/FeatureSection'
import PricingSection from '../componenets/landing/PricingSection'
import TestimonalSection from '../componenets/landing/TestimonalSection'
import CTASection from '../componenets/landing/CTASection'
import FooterSection from '../componenets/landing/FooterSection'
import { features, pricingPalns, testimonials } from '../assets/data'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {

  const {openSignIn, openSignUp} = useClerk();
  const {isSignedIn} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(isSignedIn){
      navigate('/dashboard');
    }
  },[isSignedIn, navigate]);

  return (
    <div className='landing-page bg-gradient-to-b from-gray-50 to-gray-100'>

      {/* Hero Section */}
        <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
      {/* Features Section */}
        <FeatureSection features={features}/>
      {/* Pricing Section */}
        <PricingSection pricingPlans={pricingPalns} openSignUp={openSignUp} />
      {/* Testimonials Section */}
        <TestimonalSection testimonials={testimonials}/>
      {/* CTA Section */}
        <CTASection openSignUp={openSignUp}/>
      {/* Footer Section   */}
        <FooterSection/>
    </div>
  )
}

export default Landing