import React from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import {AlertCircle, Loader2, ReceiptIndianRupee } from 'lucide-react';
import { getAuthRequestConfig } from '../util/auth';

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
        const response = await axios.get(
          apiEndpoints.GET_TRANSACTIONS,
          await getAuthRequestConfig(getToken)
        );
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
            <ReceiptIndianRupee className='text-violet-400'/>
            <h1 className='text-2xl font-bold' style={{color:'var(--text-primary)'}}>Transaction History</h1>
          </div>
          {error && (
            <div className='mb-6 p-4 dark-alert-error rounded-lg flex items-center gap-2'>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className='flex justify-center items-center h-64' style={{color:'var(--text-secondary)'}}>
              <Loader2 size={24} className='animate-spin mr-2 text-violet-400' />
              <span>Loading transactions...</span>
            </div>
          ) : (
            transactions.length === 0 ? (
              <div className='dark-empty-state p-8 text-center'>
                <ReceiptIndianRupee size={48} className='mx-auto mb-4' style={{color:'var(--text-muted)'}} />
                <h3 className='text-lg font-medium mb-2' style={{color:'var(--text-primary)'}}>
                  No transactions found.
                </h3>
                <p style={{color:'var(--text-secondary)'}}>
                  You have not made any transactions yet. Visit the Subscription page to upgrade your plan.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto rounded-xl' style={{background:'var(--bg-surface)', border:'1px solid var(--border-default)'}}>
                <table className='min-w-full dark-table'>
                  <thead>
                    <tr>
                      <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider' style={{color:'var(--text-secondary)', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-default)'}}>Date</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider' style={{color:'var(--text-secondary)', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-default)'}}>Plan</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider' style={{color:'var(--text-secondary)', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-default)'}}>Amount</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider' style={{color:'var(--text-secondary)', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-default)'}}>Credits Added</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider' style={{color:'var(--text-secondary)', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-default)'}}>Payment Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm' style={{color:'var(--text-primary)'}}>
                          {formatDate(transaction.transactionDate)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm' style={{color:'var(--text-primary)'}}>
                          {transaction.planId === "premium" ? "Premium Plan" : transaction.planId === "ultimate" ? "Ultimate Plan" : "Basic Plan"}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-green-400'>
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-violet-400'>
                          +{transaction.creditsAdded}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm' style={{color:'var(--text-secondary)'}}>
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
