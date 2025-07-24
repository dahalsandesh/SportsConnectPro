// API Base URL - Supports both emulator and mobile testing
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === '10.0.2.2' 
    ? 'http://10.0.2.2:8000'  // Android Emulator
    : 'http://192.168.18.250:8000' // Local network for mobile testing
  );

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    BOOKINGS: '/web/api/v1/user/GetBookingData',
    DASHBOARD_STATS: '/web/api/v1/user/GetDashBoardData',
    NOTIFICATIONS: '/web/api/v1/user/GetNotification',
    MARK_NOTIFICATION_READ: '/web/api/v1/user/GetNotificationById',
  },
  // Add other API endpoints as needed
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',  
};

// Default Pagination
// ... (add other configuration options as needed)
