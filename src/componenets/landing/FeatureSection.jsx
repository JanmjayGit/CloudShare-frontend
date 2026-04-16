import { ArrowUpCircle, Shield, Share2, CreditCard, FileText, Clock } from 'lucide-react'
import React from 'react'


const FeatureSection = ({features}) => {

  const rendericon = (iconName, iconColor) => {
    const iconProps = {size:25, className:iconColor}
    switch(iconName){
      case 'ArrowUpCircle':
        return <ArrowUpCircle {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
        case 'Share2':
        return <Share2 {...iconProps} />;
      case 'CreditCard':
        return <CreditCard {...iconProps} />;
      case 'FileText':
        return <FileText {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  }
  return (
    <div className='dark-section-alt py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
            <h2 className='text-3xl font-extrabold sm:text-4xl' style={{color:'var(--text-primary)'}}>
              Everything you need for file sharing
            </h2>
            <p className='mt-4 max-w-2xl mx-auto text-xl' style={{color:'var(--text-secondary)'}}>
              Cloudshare provides all the tools you need to manage your files securely and efficiently.
            </p>
        </div>
        <div className='mt-16'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              {features.map((feature,index) => (
                <div key={index} className='dark-feature-card pt-5'>
                  <div className='flow-root rounded-lg px-6 pb-8' style={{background:'rgba(30,41,59,0.5)'}}>
                    <div className='-mt-6'>
                      <div className='dark-icon-container inline-flex items-center justify-center p-3 rounded-md'>
                        {rendericon(feature.iconName, feature.iconColor)}
                      </div>
                      <h3 className='mt-5 text-lg font-medium tracking-tight' style={{color:'var(--text-primary)'}}>
                        {feature.title}
                      </h3>
                      <p className='mt-2 text-base' style={{color:'var(--text-secondary)'}}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
                
            </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection