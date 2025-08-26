import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { io } from 'socket.io-client';

class DuplicateLoginManager {
  constructor() {
    this.socket = null;
    this.visitorId = null;
    this.healthCheckInterval = null;
    this.reconnectInterval = null;
    this.heartbeatInterval = null;
    this.userId = null;
    this.backendUrl = null;
    this.lastRegistered = 0;
    this.isConnecting = false;
    this.connectionAttempts = 0;
    this.callbacks = {
      onDuplicateLogin: null,
      onSessionRegistered: null,
      onLogoutSuccess: null,
      onDisconnect: null,
      onConnect: null,
      onError: null
    };
  }

  getBrowserInfo() {
    const ua = navigator.userAgent;
    const browserInfo = {
      userAgent: ua,
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Desktop'
    };
    
    // More accurate browser detection (order matters)
    if (/(OPR|Opera)/i.test(ua)) {
      browserInfo.browser = 'Opera';
    } else if (/(Edg|Edge)/i.test(ua)) {
      browserInfo.browser = 'Microsoft Edge';
    } else if (/Firefox/i.test(ua)) {
      browserInfo.browser = 'Firefox';
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
      browserInfo.browser = 'Safari';
    } else if (/Chrome/i.test(ua)) {
      browserInfo.browser = 'Chrome';
    } else if (/MSIE|Trident/i.test(ua)) {
      browserInfo.browser = 'Internet Explorer';
    } else if (/UCBrowser/i.test(ua)) {
      browserInfo.browser = 'UC Browser';
    } else if (/SamsungBrowser/i.test(ua)) {
      browserInfo.browser = 'Samsung Browser';
    }
    
    // Improved OS detection
    if (/Windows NT 10.0/i.test(ua)) {
      browserInfo.os = 'Windows 10';
    } else if (/Windows NT 6.3/i.test(ua)) {
      browserInfo.os = 'Windows 8.1';
    } else if (/Windows NT 6.2/i.test(ua)) {
      browserInfo.os = 'Windows 8';
    } else if (/Windows NT 6.1/i.test(ua)) {
      browserInfo.os = 'Windows 7';
    } else if (/Windows/i.test(ua)) {
      browserInfo.os = 'Windows';
    } else if (/Mac OS X/i.test(ua) || /Macintosh/i.test(ua)) {
      browserInfo.os = 'macOS';
    } else if (/Android/i.test(ua)) {
      browserInfo.os = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      browserInfo.os = 'iOS';
    } else if (/Linux/i.test(ua)) {
      browserInfo.os = 'Linux';
    } else if (/CrOS/i.test(ua)) {
      browserInfo.os = 'ChromeOS';
    }
    
    // Improved device type detection
    if (/Mobile|Android.*Mobile|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua)) {
      browserInfo.device = 'Mobile';
      
      // Further refine to detect tablets
      if (/iPad|Android(?!.*Mobile)/i.test(ua)) {
        browserInfo.device = 'Tablet';
      }
    }
    
    return browserInfo;
  }

  async initialize(userId, backendUrl) {
    try {
      if (!userId || !backendUrl) {
        console.error('DuplicateLoginManager: Missing required parameters');
        return false;
      }

      if (this.isConnecting) {
        console.log('Already attempting to connect, waiting...');
        return true;
      }

      this.isConnecting = true;
      this.connectionAttempts++;
      
      // Store user ID and backend URL for reconnection purposes
      this.userId = userId;
      this.backendUrl = backendUrl;

      // Clean up any existing connection
      this.cleanup();

      // Get fingerprint
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        this.visitorId = result.visitorId;
        
        // Store fingerprint in sessionStorage for persistence across refreshes
        sessionStorage.setItem('dlm_fingerprint', this.visitorId);
      } catch (fingerPrintError) {
        console.error('DuplicateLoginManager: Using fallback fingerprint');
        // Try to get from sessionStorage first
        this.visitorId = sessionStorage.getItem('dlm_fingerprint') || 
          `fallback-${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        
        // Store the fallback fingerprint
        if (!sessionStorage.getItem('dlm_fingerprint')) {
          sessionStorage.setItem('dlm_fingerprint', this.visitorId);
        }
      }

      // Get browser info
      const browserInfo = this.getBrowserInfo();

      // Initialize socket with aggressive settings for reliability
      this.socket = io(backendUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 30,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        autoConnect: true,
        forceNew: true
      });

      // Set up socket connection event handlers
      this.socket.on('connect', () => {
        this.isConnecting = false;
        this.connectionAttempts = 0;
        
        // Register session immediately on connect
        this.registerSession(userId, browserInfo);
        
        // Start health check and heartbeat intervals
        this.startHealthCheck();
        this.startHeartbeat();
        
        // Clear any existing reconnect interval
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }

        if (this.callbacks.onConnect) {
          this.callbacks.onConnect();
        }
        
        // Force check for duplicate sessions immediately after connect
        setTimeout(() => {
          this.checkForDuplicateSessions(userId);
        }, 1500);
      });

      this.socket.on('connect_error', (error) => {
        // Start aggressive reconnection strategy if not already running
        this.startReconnectStrategy();

        if (this.callbacks.onError) {
          this.callbacks.onError(error);
        }
      });

      // Set up event listeners
      this.setupEventListeners();
      
      // Add page visibility change handling
      this.setupVisibilityHandling();

      return true;
    } catch (error) {
      console.error('DuplicateLoginManager: Initialization failed');
      this.isConnecting = false;
      return false;
    }
  }

  startHeartbeat() {
    // Clear any existing interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Set up heartbeat interval - keeps the session active on the server
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected && this.userId) {
        this.socket.emit('heartbeat', { 
          userId: this.userId,
          fingerprint: this.visitorId,
          timestamp: Date.now()
        });
      }
    }, 15000); // Send heartbeat every 15 seconds
  }

  startReconnectStrategy() {
    if (this.reconnectInterval) {
      return; // Already reconnecting
    }
    
    this.reconnectInterval = setInterval(() => {
      if (!this.socket || !this.socket.connected) {
        if (this.socket) {
          // Try reconnecting the existing socket
          this.socket.connect();
        } else if (this.userId && this.backendUrl && !this.isConnecting) {
          // Create a new socket if the old one is gone
          console.log('Socket missing, attempting to reinitialize');
          this.initialize(this.userId, this.backendUrl);
        }
      } else {
        // If connected, try to re-register the session if it's been a while
        const now = Date.now();
        if (now - this.lastRegistered > 45000) { // Re-register every 45 seconds
          this.registerSession(this.userId, this.getBrowserInfo());
        }
      }
    }, 8000); // Try every 8 seconds
  }

  startHealthCheck() {
    // Clear any existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // Perform an immediate health check
    if (this.socket && this.socket.connected && this.userId) {
      this.socket.emit('health_check', (response) => {
        // If we have a good response, check for duplicate sessions
        if (response && response.status === 'ok') {
          setTimeout(() => {
            this.checkForDuplicateSessions(this.userId);
          }, 500);
        }
      });
    }
    
    // Set up health check interval
    this.healthCheckInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('health_check', (response) => {
          // If we have a good response, try registering the session again
          if (response && response.status === 'ok') {
            // Re-register occasionally to ensure the server knows we're still active
            const now = Date.now();
            if (now - this.lastRegistered > 45000) { // Re-register every 45 seconds
              this.registerSession(this.userId, this.getBrowserInfo());
              
              // Also periodically check for duplicate sessions
              this.checkForDuplicateSessions(this.userId);
            }
          }
        });
      } else if (this.socket && !this.socket.connected && this.userId) {
        this.socket.connect();
        
        // Start aggressive reconnection strategy
        this.startReconnectStrategy();
      }
    }, 20000); // Check every 20 seconds
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Remove existing listeners to avoid duplicates
    this.socket.off('duplicate_login_detected');
    this.socket.off('session_registered');
    this.socket.off('logout_success');
    this.socket.off('logout_error');
    this.socket.off('disconnect');
    this.socket.off('connect_error');
    this.socket.off('reconnect');
    this.socket.off('reconnect_attempt');
    this.socket.off('duplicate_sessions_check_result');
    this.socket.off('refresh_detected');
    
    // Re-add the listeners
    this.socket.on('duplicate_login_detected', (data) => {
      // Add a timestamp if one doesn't exist
      if (!data.timestamp) {
        data.timestamp = new Date().toISOString();
      }
      
      // Make sure deviceInfo exists and has the expected structure
      if (!data.deviceInfo) {
        data.deviceInfo = this.getBrowserInfo(); // Use current device info as fallback
      }
      
      if (this.callbacks.onDuplicateLogin) {
        this.callbacks.onDuplicateLogin(data);
      }
    });

    this.socket.on('duplicate_sessions_check_result', (data) => {
      if (data.hasDuplicates && this.callbacks.onDuplicateLogin) {
        // Format the duplicate login data
        const duplicateData = {
          message: data.message || 'Phát hiện đăng nhập trùng lặp',
          timestamp: data.timestamp || new Date().toISOString(),
          deviceInfo: data.deviceInfo || this.getBrowserInfo()
        };
        
        this.callbacks.onDuplicateLogin(duplicateData);
      }
    });
    
    this.socket.on('refresh_detected', (data) => {
      // This happens when the server detects what appears to be a page refresh
      // Re-register the session to confirm we're still active
      if (this.userId) {
        setTimeout(() => {
          this.registerSession(this.userId, this.getBrowserInfo());
        }, 500);
      }
    });

    this.socket.on('session_registered', (response) => {
      // Mark last registered time
      this.lastRegistered = Date.now();
      
      // If this is the first successful registration, ensure we're listening for events
      if (response.success) {
        // Force a heartbeat immediately after successful registration
        this.socket.emit('heartbeat', { 
          userId: this.userId,
          fingerprint: this.visitorId,
          timestamp: Date.now()
        });
        
        // Also check for duplicate sessions after a successful registration
        setTimeout(() => {
          this.checkForDuplicateSessions(this.userId);
        }, 1000);
      }
      
      if (this.callbacks.onSessionRegistered) {
        this.callbacks.onSessionRegistered(response);
      }
    });

    this.socket.on('logout_success', () => {
      if (this.callbacks.onLogoutSuccess) {
        this.callbacks.onLogoutSuccess();
      }
    });

    this.socket.on('logout_error', (data) => {
      console.error('Logout error:', data?.message);
    });

    this.socket.on('disconnect', (reason) => {
      if (this.callbacks.onDisconnect) {
        this.callbacks.onDisconnect(reason);
      }
      
      // Auto-reconnect if not intentionally disconnected
      if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'ping timeout') {
        if (this.socket) {
          this.socket.connect();
        }
        
        // Start aggressive reconnection strategy
        this.startReconnectStrategy();
      }
    });
    
    this.socket.on('connect_error', (error) => {
      this.startReconnectStrategy();
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    });
    
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      // Re-register session after successful reconnection
      if (this.userId) {
        this.registerSession(this.userId, this.getBrowserInfo());
      }
    });
    
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt #${attemptNumber}`);
    });
  }

  registerSession(userId, browserInfo) {
    if (!userId) {
      console.error('Cannot register session - missing userId');
      return false;
    }
    
    if (this.socket && this.visitorId) {
      // Ensure browser info has the right structure
      const deviceInfo = browserInfo || this.getBrowserInfo();
      
      this.socket.emit('register_session', {
        userId,
        fingerprint: this.visitorId,
        deviceInfo: deviceInfo,
        timestamp: Date.now() // Add timestamp to help with session ordering
      });
      
      // Track last registration attempt
      this.lastRegistered = Date.now();
      return true;
    } else if (!this.socket && this.visitorId && this.userId && this.backendUrl && !this.isConnecting) {
      // If we have what we need but the socket is missing, try to reconnect
      this.initialize(this.userId, this.backendUrl);
      return false;
    }
    return false;
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  logout(userId) {
    if (this.socket) {
      // Send logout event first
      this.socket.emit('logout', { userId });
      
      // Clear user ID to prevent attempts to reconnect after logout
      this.userId = null;
      
      // After a short delay to ensure logout message was sent, perform full cleanup
      setTimeout(() => {
        this.cleanup();
      }, 500);
    }
  }

  cleanup() {
    // Clear health check interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    // Clear reconnect interval
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    // Clear heartbeat interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Remove visibility event listeners
    document.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
    
    // Remove all listeners and disconnect socket
    if (this.socket) {
      this.socket.off('duplicate_login_detected');
      this.socket.off('session_registered');
      this.socket.off('logout_success');
      this.socket.off('logout_error');
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.socket.off('connect_error');
      this.socket.off('reconnect');
      this.socket.off('reconnect_attempt');
      this.socket.off('duplicate_sessions_check_result');
      this.socket.off('refresh_detected');
      
      // Disconnect socket
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Reset connection state
    this.isConnecting = false;
    this.connectionAttempts = 0;
  }

  // Debug method to check current state
  getStatus() {
    return {
      hasSocket: Boolean(this.socket),
      connected: this.socket ? this.socket.connected : false,
      socketId: this.socket ? this.socket.id : null,
      userId: this.userId,
      visitorId: this.visitorId ? this.visitorId.substring(0, 10) + '...' : null, // Truncated for privacy
      lastRegistered: this.lastRegistered ? new Date(this.lastRegistered).toISOString() : null,
      timeSinceLastRegistered: this.lastRegistered ? (Date.now() - this.lastRegistered) / 1000 + ' seconds' : 'never',
      isConnecting: this.isConnecting,
      connectionAttempts: this.connectionAttempts,
      hasCallbacks: {
        onDuplicateLogin: Boolean(this.callbacks.onDuplicateLogin),
        onSessionRegistered: Boolean(this.callbacks.onSessionRegistered),
        onLogoutSuccess: Boolean(this.callbacks.onLogoutSuccess),
        onDisconnect: Boolean(this.callbacks.onDisconnect)
      }
    };
  }

  setupVisibilityHandling() {
    // Handle page visibility change (tab focus/unfocus/refresh)
    document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
    
    // Handle before unload to properly signal navigation away
    window.addEventListener("beforeunload", () => {
      // Mark session as potentially ending - but don't fully logout
      // This helps with refresh detection vs. actual navigation away
      if (this.socket && this.socket.connected) {
        this.socket.emit('page_refresh_pending', { 
          userId: this.userId,
          fingerprint: this.visitorId,
          timestamp: Date.now()
        });
      }
    });
    
    // Handle page load/reload completion
    window.addEventListener("load", () => {
      if (this.userId && this.visitorId) {
        // First, ensure we're connected
        if (this.socket && !this.socket.connected) {
          this.socket.connect();
        }
        
        // After a delay to allow connection, re-register and check for duplicates
        setTimeout(() => {
          this.registerSession(this.userId, this.getBrowserInfo());
          this.checkForDuplicateSessions(this.userId);
        }, 1000);
      }
    });
  }
  
  handleVisibilityChange() {
    // When page becomes visible again after being hidden (tab switch, etc)
    if (!document.hidden && this.userId && this.visitorId) {
      // Re-establish connection if needed
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
      
      // Re-register session and check for duplicates
      setTimeout(() => {
        this.registerSession(this.userId, this.getBrowserInfo());
        this.checkForDuplicateSessions(this.userId);
      }, 1000);
    }
  }
  
  checkForDuplicateSessions(userId) {
    if (!userId || !this.socket || !this.socket.connected) return;
    
    // Ask server to check for duplicate sessions
    this.socket.emit('check_duplicate_sessions', {
      userId,
      fingerprint: this.visitorId,
      timestamp: Date.now()
    });
  }
}

// Single instance for the application
export const duplicateLoginManager = new DuplicateLoginManager(); 