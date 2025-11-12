import React, { useEffect, useRef } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import { UserCreditsContext } from '../context/UserCreditsContext'
import { AlertCircle, CreditCard, Check, Loader2} from 'lucide-react'
import axios from 'axios'
import apiEndpoints from '../util/apiEndpoints'


const Subscription = () => {

  
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // info, success, error
  const {getToken} = useAuth();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const {credits, updateCredits, fetchUserCredits} = useContext(UserCreditsContext);
  const razorpayScriptRef = useRef(null);

  const {user} = useUser();

  const plans = [
    {
      id:"premium",
      name:"Premium",
      credits:1000,
      price:500,
      features:[
        "upload up to 1000 files",
        "Access to all basic features",
        "Priority customer support",
      ],
      recommended:false
  },
  {
      id:"ultimate",
      name:"Ultimate",
      credits:5000,
      price:2500,
      features:[
        "upload up to 5000 files",
        "Access to all premium features",
        "24/7 dedicated support",
        "Early access to new features",
      ],
      recommended:true
  }
  ];

  // load razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setMessage("Failed to load payment gateway. Please try again later.");
        setMessageType("error");
      };
      document.body.appendChild(script);
      razorpayScriptRef.current = script;
    }else{
      setRazorpayLoaded(true);
    }
    return() => {
      if(razorpayScriptRef.current){
        document.body.removeChild(razorpayScriptRef.current);
      }
    };
  }, []);

  // fetch user credits on component mount
  useEffect(() => {
    const fetchUserCredits = async () => {
      try{
        const token = await getToken();
        const response = await axios.get(apiEndpoints.GET_CREDITS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        updateCredits(response.data.credits);
      }catch(error){
        console.error("Error fetching user credits:", error);
        setMessage("Error fetching user credits. Please try again later.");
        setMessageType("error");
      }
    };
    fetchUserCredits();
    
  }, [getToken, updateCredits]); 

  // handle purchase plan
  const handlePurchase = async (plan) => {
    if (!razorpayLoaded) {
      setMessage("Payment gateway is not loaded yet. Please try again later.");
      setMessageType("error");
      return;
    }

    setProcessingPlanId(plan.id); 
    setMessage("");
    setMessageType("");
    
    try{
      const token = await getToken();
      const response = await axios.post(apiEndpoints.CREATE_ORDER, {
        planId: plan.id,
        amount: plan.price * 100,
        currency: "INR",
        credits: plan.credits
      },{
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: import.meta.env.VITE_RAZOPAY_KEY,
        amount: plan.price * 100,
        currency: "INR",
        name: "CloudShare",
        description: `Purchase ${plan.credits} credits`,
        order_id: response.data.orderId,
        handler: async function(response) {
          try{
            const verifyResponse = await axios.post(apiEndpoints.VERIFY_PAYMENT, {
              razorpay_order_id: response.razorpay_order_id,      
              razorpay_payment_id: response.razorpay_payment_id,  
              razorpay_signature: response.razorpay_signature,
              planId: plan.id
            },{
              headers: { Authorization: `Bearer ${token}` }
            });

            if(verifyResponse.data.success){
              if(verifyResponse.data.credits){
                console.log('Updating credits to:', verifyResponse.data.credits);
                updateCredits(verifyResponse.data.credits);
              }else{
                console.log('credits not in response, fetching latest credits');
                await fetchUserCredits();
              }
              setMessage(`Payment successful! ${plan.name} plan activated.`);
              setMessageType("success");
            }else{
              setMessage("Payment verification failed. Please contact support.");
              setMessageType("error");
            }
          }catch(error){
            console.error("Error verifying payment:", error);
            setMessage("Error verifying payment. Please contact support.");
            setMessageType("error");
          } finally {
            setProcessingPlanId(null); // Add this to reset after verification
          }
        },
        prefill: {
          name:user.fullName,
          email:user.primaryEmailAddress
        },
        theme: {
          color: "#6b46c1"
        },
        modal: {
          ondismiss: function() {
            setProcessingPlanId(null); // Reset when modal is closed
          }
        }
      };

      if(window.Razorpay){
        const rzp = new window.Razorpay(options);
        rzp.open();
      }else{
        throw new Error("Razorpay SDK not loaded");
      }
    }catch(error){
      console.error("Error processing payment:", error);
      setMessage("Error processing payment. Please try again later.");
      setMessageType("error");
      setProcessingPlanId(null); 
    }
  };

  return (
    <DashboardLayout activeMenu="Subscription">
        <div className='p-6 '>
          <h1 className='text-2xl font-bold mb-2'>Subscription Plans</h1>
          <p className='text-gray-600 mb-6'>Choose aplan that works for you</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'error' ? 'bg-red-50 text-red-700' : 
                messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}
            >
              {messageType === 'error' && <AlertCircle size={20} />}
              {message}
            </div>
          )}

          <div className='flex flex-col md:flex-row gap-6 mb-8'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <div className='flex items-center gap-2 mb-4'>
                <CreditCard size={20} className='text-purple-700'/>
                <h2 className='text-lg font-medium'>Current Credits : <span className='font-bold text-purple-500'>{credits}</span></h2>
              </div>
              <p className='text-sm text-gray-600 t-2'>
                you can upload {credits} more files with your current credits.
              </p>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-xl p-6 ${
                  plan.recommended ? 'border-purple-200 bg-purple-50 shadow-md' : 'border-gray-200 bg-white'
                }`}>
                  {plan.recommended && (
                    <div className='inline-block bg-purple-500 text-white text-xs font-semibold rounded-2xl px-3 py-1 mb-4'>
                      Recommended
                    </div>
                  )}
                  <h3 className='text-xl font-bold'>{plan.name}</h3>
                  <div className='mt-2 mb-4'>
                    <span className='text-3xl font-bold'>₹{plan.price}</span>
                    <span className='text-gray-500'>for {plan.credits} credits</span>
                  </div>

                  <ul className='space-y-3 mb-6'>
                    {plan.features.map((feature, index) => (
                      <li key={index} className='flex items-start'>
                        <Check size={18} className='text-green-500 mr-2 mt-0.5 flex-shrink'/>
                        <span className='text-gray-700'>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={processingPlanId !== null}
                    className={`w-full py-3 rounded-md font-medium transition-colors ${
                      plan.recommended
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-white text-purple-500 border border-purple-500 hover:bg-purple-50'
                    } disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {processingPlanId === plan.id ? (
                      <>
                        <Loader2 size={16} className='animate-spin'/>
                        <span>Processing...</span>
                      </>
                    ): (
                      <span>Purchase Plan</span>
                    )}
                  </button>
              </div>
            ))}
          </div>

          <div className='mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200'>
            <h3 className='font-medium mb-2'>How credits work</h3>
            <p className='text-sm text-gray-600'>
              Each credit allows you to upload one file. For example, if you have 5 credits, you can upload up to 5 files. Your credits will decrease with each file upload and you can purchase additional credits by subscribing to a plan.
            </p>
          </div>
        </div>
    </DashboardLayout>
  )
}

export default Subscription