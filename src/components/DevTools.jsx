import { useEffect } from 'react';
import { testDuplicateLoginSystem, simulateDuplicateLogin, getDuplicateLoginStatus } from '@/utils/testDuplicateLogin';

/**
 * Development tools for testing - no visual rendering
 */
const DevTools = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Expose test functions to window
      window.testDuplicateLoginSystem = testDuplicateLoginSystem;
      window.simulateDuplicateLogin = simulateDuplicateLogin;
      window.getDuplicateLoginStatus = getDuplicateLoginStatus;
    }
  }, []);

  return null;
};

export default DevTools; 