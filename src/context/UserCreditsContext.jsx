import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiEndpoints from '../util/apiEndpoints';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { getAuthRequestConfig } from '../util/auth';

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children }) => {
    const [credits, setCredits] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken, isSignedIn, isLoaded } = useAuth();

    const fetchUserCredits = useCallback(async () => {
        if (!isLoaded || !isSignedIn) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(apiEndpoints.GET_CREDITS, {
                ...(await getAuthRequestConfig(getToken))
            });

            setCredits(response.data.credits); // Removed duplicate setCredits

        } catch (error) {
            console.error('Error fetching user credits:', error);
            toast.error('Failed to fetch user credits');
        } finally {
            setIsLoading(false);
        }
    }, [getToken, isLoaded, isSignedIn]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchUserCredits();
        }
    }, [fetchUserCredits, isLoaded, isSignedIn]);

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

    return (
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    )
}
