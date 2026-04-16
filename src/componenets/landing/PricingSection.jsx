import { Check } from 'lucide-react'
import React from 'react'

const PricingSection = ({pricingPlans, openSignUp}) => {

  
  return (
    <div className='dark-section-base py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
            <h2 className='text-3xl font-extrabold sm:text-4xl' style={{color:'var(--text-primary)'}}>
              Simple and Transparent Pricing
            </h2>
            <p className='mt-4 max-w-2xl mx-auto' style={{color:'var(--text-secondary)'}}>
              Choose a plan that fits your needs. No hidden fees, cancel anytime.
            </p>
        </div>
        <div className='mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8'>
            {pricingPlans.map((plan,index) => (
              <div key={index} className={`flex flex-col rounded-xl overflow-hidden transition-all duration-300 ${plan.highlighted ? 'pricing-card-highlight' : 'dark-card'}`}
                   style={plan.highlighted ? {background:'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(15,23,42,1))'} : {}}>
                <div className='px-6 py-8'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-2xl font-medium' style={{color:'var(--text-primary)'}}>
                      {plan.name}
                    </h3>
                    {plan.highlighted && (
                      <span className='inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'
                            style={{background:'rgba(139,92,246,0.2)', color:'var(--accent-400)', border:'1px solid rgba(139,92,246,0.4)'}}>
                        Popular
                      </span>
                    )}
                  </div>
                  <p className='mt-4 text-sm' style={{color:'var(--text-secondary)'}}>
                    {plan.description}
                  </p>
                  <p className='mt-8'>
                    <span className='text-3xl font-extrabold' style={{color:'var(--text-primary)'}}>
                      ₹{plan.price}
                    </span>
                  </p>
                </div>

                <div className='flex flex-1 flex-col justify-between px-6 pt-6 pb-8 space-y-6'
                     style={{background:'rgba(15,23,42,0.4)'}}>
                  <ul className='space-y-4'>
                    {plan.features.map((feature,idx) => (
                      <li key={idx} className='flex items-start'>
                        <div className='flex-shrink-0'>
                          <Check className='h-5 w-5 text-green-400' aria-hidden="true"/>
                        </div>
                        <p className='text-base ml-3' style={{color:'var(--text-secondary)'}}>{feature}</p>
                      </li>
                    ))}
                  </ul>

                  <div className='rounded-md shadow'>
                    <button
                      onClick={() => openSignUp()} 
                      className={`w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-md transition-colors duration-200 ${plan.highlighted ? 'btn-primary' : 'btn-purple-outline'}`}>
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PricingSection