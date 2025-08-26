/**
 * Utility functions to test the duplicate login detection system
 * For development use only
 */

import { duplicateLoginManager } from '../services/duplicateLoginService';

/**
 * Simulates a duplicate login detection event
 */
export const simulateDuplicateLogin = (userId, options = {}) => {
  // Create mock data
  const mockData = {
    message: options.message || 'This is a test duplicate login alert.',
    timestamp: options.timestamp || new Date().toISOString(),
    deviceInfo: options.deviceInfo || {
      browser: options.browser || 'Chrome',
      os: options.os || 'Windows',
      device: options.device || 'Desktop'
    }
  };
  
  // Call the callback directly as if the server sent an event
  if (duplicateLoginManager.callbacks?.onDuplicateLogin) {
    duplicateLoginManager.callbacks.onDuplicateLogin(mockData);
    return true;
  }
  return false;
};

/**
 * Gets the current status of the duplicate login manager
 */
export const getDuplicateLoginStatus = () => {
  return duplicateLoginManager.getStatus();
};

/**
 * Test the duplicate login modal
 */
export const testDuplicateLoginSystem = () => {
  const status = getDuplicateLoginStatus();
  if (status.userId) {
    return simulateDuplicateLogin(status.userId);
  }
  return false;
};

// Expose in development only
if (process.env.NODE_ENV !== 'production') {
  window.testDuplicateLoginSystem = testDuplicateLoginSystem;
  window.simulateDuplicateLogin = simulateDuplicateLogin;
  window.getDuplicateLoginStatus = getDuplicateLoginStatus;
} 