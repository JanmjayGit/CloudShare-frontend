import React from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import {AlertCircle, Loader2, ReceiptIndianRupee } from 'lucide-react';

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try{
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(apiEndpoints.GET_TRANSACTIONS, {headers: {Authorization: `Bearer ${token}`}});
        setTransactions(response.data);
        setError(null);
      }catch(error){
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions history. Please try again later.');
      }finally{
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [getToken]);

  const formatDate= (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // format amount from paise to rupees
  const formatAmount = (amountInPaise) => {
    return `₹${(amountInPaise / 100).toFixed(2)}`;
  };

  
  return (
    <DashboardLayout activeMenu="Transactions">
        <div className='p-6'>
          <div className='flex items-center gap-2 mb-6'>
            <ReceiptIndianRupee className='text-blue-600'/>
            <h1 className='text-2xl font-bold'>Transaction History</h1>
          </div>
          {error && (
            <div className='mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center'>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 size={24} className='animate-spin mr-2' />
              <span>Loading transactions...</span>
            </div>
          ) : (
            transactions.length === 0 ? (
              <div className='bg-gray-50 p-8 rounded-lg text-center'>
                <ReceiptIndianRupee size={48} className='mx-auto text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-700 mb-2'>
                  No transactions found.
                </h3>
                <p className='text-gray-500'>
                  You have not made any transactions yet. Visit the Subscription page to upgrade your plan.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white rounded-lg overflow-hidden shadow'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200'>Date</th>
                      <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200'>Plan</th>
                      <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200'>Amount</th>
                      <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200'>Credits Added</th>
                      <th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200'>Payment Id</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatDate(transaction.transactionDate)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {transaction.planId === "premium" ? "Premium Plan" : transaction.planId === "ultimate" ? "Ultimate Plan" : "Basic Plan"}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {transaction.creditsAdded}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {transaction.paymentId ? transaction.paymentId.substring(0, 12) + "..." : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
    </DashboardLayout>
  )
}

export default Transactions