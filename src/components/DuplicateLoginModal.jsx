import React from 'react';
import { AlertTriangle, LogOut, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import { duplicateLoginManager } from '@/services/duplicateLoginService';
import useAuthToken from '@/hooks/userAuthToken';

// Import directly from the context to access the shared state
import { useDuplicateLogin } from '@/context/DuplicateLoginContext';

const DuplicateLoginModal = ({ isOpen, data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAuthToken();
  
  // Get the setter function from context
  const { resetDuplicateLoginState } = useDuplicateLogin();

  // Don't render if not open or no data
  if (!isOpen || !data) {
    return null;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleLogout = () => {
    try {
      // First, reset the duplicate login state to hide the modal
      if (resetDuplicateLoginState) {
        resetDuplicateLoginState();
      }
      
      // Then perform the actual logout operation
      if (auth?.id) {
        duplicateLoginManager.logout(auth.id);
        duplicateLoginManager.cleanup();
      }
      
      // Remove the token and clear user state
      localStorage.removeItem("token");
      dispatch(clearUser());
      
      // Finally, navigate to login page
      navigate("/login");
    } catch (error) {
      // Fallback logout - ensure we still navigate even if there was an error
      localStorage.removeItem("token");
      dispatch(clearUser());
      navigate("/login");
    }
  };

  const getDeviceInfo = () => {
    // If no data at all
    if (!data) {
      return 'Thiết bị không xác định';
    }

    // If deviceInfo exists in any form
    if (data.deviceInfo) {
      // If deviceInfo is already a string, use it directly
      if (typeof data.deviceInfo === 'string') {
        return data.deviceInfo;
      }
      
      // Otherwise, try to extract properties from object
      const { browser, os, device } = data.deviceInfo;
      
      // If we have either browser or OS info (not requiring both)
      if (browser || os) {
        return `${browser || 'Trình duyệt không xác định'} trên ${os || 'Hệ điều hành không xác định'} (${device || 'Desktop'})`;
      }
      
      // If we have userAgent but no structured data
      if (data.deviceInfo.userAgent) {
        const ua = data.deviceInfo.userAgent;
        
        let browserName = 'Trình duyệt không xác định';
        if (ua.includes('Edg/') || ua.includes('Edge/')) browserName = 'Microsoft Edge';
        else if (ua.includes('Firefox/')) browserName = 'Firefox';
        else if (ua.includes('Chrome/')) browserName = 'Chrome';
        else if (ua.includes('Safari/')) browserName = 'Safari';
        
        let osName = 'Hệ điều hành không xác định';
        if (ua.includes('Windows NT')) osName = 'Windows';
        else if (ua.includes('Macintosh')) osName = 'macOS';
        else if (ua.includes('Linux')) osName = 'Linux';
        else if (ua.includes('Android')) osName = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) osName = 'iOS';
        
        return `${browserName} trên ${osName} (${device || 'Desktop'})`;
      }
    }
    
    // If we got here, we have data but no useful device info
    return 'Thiết bị không xác định';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 flex items-center" id="modal-title">
          <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
              Cảnh báo bảo mật
            </h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Phát hiện đăng nhập trùng lặp
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-gray-700 dark:text-gray-300">
            {data.message || 'Tài khoản của bạn đã được truy cập từ một thiết bị khác.'}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 space-y-3">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thông tin thiết bị:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getDeviceInfo()}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thời gian:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(data.timestamp)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Only logout button */}
        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateLoginModal; 