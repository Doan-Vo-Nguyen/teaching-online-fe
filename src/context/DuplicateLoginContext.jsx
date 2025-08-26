import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { duplicateLoginManager } from '../services/duplicateLoginService';
import useAuthToken from '@/hooks/userAuthToken';
import { useSelector } from 'react-redux';
import DuplicateLoginModal from '@/components/DuplicateLoginModal';

const DuplicateLoginContext = createContext();

export const useDuplicateLogin = () => {
  const context = useContext(DuplicateLoginContext);
  if (!context) {
    throw new Error('useDuplicateLogin must be used within a DuplicateLoginProvider');
  }
  return context;
};

export const DuplicateLoginProvider = ({ children }) => {
  const auth = useAuthToken();
  const userData = useSelector((state) => state.user.user);
  const [isDuplicateLogin, setIsDuplicateLogin] = useState(false);
  const [duplicateLoginData, setDuplicateLoginData] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState(null);
  const initialized = useRef(false);
  
  // Reset duplicate login state - used when logging out
  const resetDuplicateLoginState = useCallback(() => {
    setIsDuplicateLogin(false);
    setDuplicateLoginData(null);
  }, []);
  
  // When auth changes, initialize or cleanup
  useEffect(() => {
    // If user logged out, reset duplicate login state
    if (!auth?.id && initialized.current) {
      resetDuplicateLoginState();
      duplicateLoginManager.cleanup();
      initialized.current = false;
      return;
    }
    
    if (auth?.id) {
      // Get backend URL from environment variables
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';
      
      // Track initialization to prevent duplicate initializations
      if (initialized.current) {
        duplicateLoginManager.cleanup();
      }
      
      // Initialize duplicate login manager
      const initSuccess = duplicateLoginManager.initialize(auth.id, backendUrl);
      initialized.current = true;
      
      if (!initSuccess) {
        console.error("Failed to initialize duplicate login detection");
        return;
      }

      // Set up callbacks
      duplicateLoginManager.setCallbacks({
        onDuplicateLogin: (data) => {
          // Force duplicate login modal to show
          setIsDuplicateLogin(true);
          
          // Ensure deviceInfo is properly passed along
          const enhancedData = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            message: data.message || 'Phát hiện đăng nhập từ thiết bị khác.'
          };
          
          setDuplicateLoginData(enhancedData);
        },
        onSessionRegistered: (response) => {
          if (!response.success) {
            setSocketError('Failed to register session: ' + response.message);
            
            // Try to re-register after a delay
            setTimeout(() => {
              const status = duplicateLoginManager.getStatus();
              if (status.connected) {
                duplicateLoginManager.registerSession(auth.id, duplicateLoginManager.getBrowserInfo());
              }
            }, 5000);
          }
        },
        onLogoutSuccess: () => {
          resetDuplicateLoginState();
        },
        onConnect: () => {
          setIsSocketConnected(true);
          setSocketError(null);
        },
        onDisconnect: () => {
          setIsSocketConnected(false);
        },
        onError: (error) => {
          setSocketError(error.message);
        }
      });
      
      // Check connection status periodically
      const intervalId = setInterval(() => {
        const status = duplicateLoginManager.getStatus();
        if (!status.connected && status.hasSocket) {
          // Try to reconnect
          duplicateLoginManager.socket?.connect();
        }
      }, 15000);

      // Cleanup on unmount or when auth changes
      return () => {
        clearInterval(intervalId);
        duplicateLoginManager.cleanup();
        initialized.current = false;
      };
    }
  }, [auth?.id, resetDuplicateLoginState]);

  const value = {
    isDuplicateLogin,
    duplicateLoginData,
    isSocketConnected,
    socketError,
    resetDuplicateLoginState
  };

  return (
    <DuplicateLoginContext.Provider value={value}>
      {children}
      {isDuplicateLogin && duplicateLoginData && (
        <DuplicateLoginModal 
          isOpen={isDuplicateLogin} 
          data={duplicateLoginData}
        />
      )}
    </DuplicateLoginContext.Provider>
  );
}; 