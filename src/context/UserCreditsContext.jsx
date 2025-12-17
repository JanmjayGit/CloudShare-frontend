import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiEndpoints from '../util/apiEndpoints';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children }) => {
    const [credits, setCredits] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const {getToken, isSignedIn} = useAuth();

    const fetchUserCredits = useCallback(async () => {
        if (!isSignedIn) {
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.GET_CREDITS, {
                headers: {Authorization: `Bearer ${token}`}
            });
            
            setCredits(response.data.credits); // Removed duplicate setCredits
            
        } catch (error) {
            console.error('Error fetching user credits:', error);
            toast.error('Failed to fetch user credits');
        } finally {
            setIsLoading(false);
        }
    }, [getToken, isSignedIn]);
    
    useEffect(() => {
        if (isSignedIn) {
            fetchUserCredits();
        }
    }, [fetchUserCredits, isSignedIn]);

    const updateCredits = useCallback(newCredits => {
        console.log("Updating the credits:", newCredits);
        setCredits(newCredits);
    }, [])

    const contextValue = {
        credits,
        isLoading,
        fetchUserCredits,
        updateCredits,
    }

    return(
        <UserCreditsContext.Provider value={contextValue}> 
            {children}
        </UserCreditsContext.Provider>  
    )
}