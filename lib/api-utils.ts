import { headers } from 'next/headers';

// Always use the same base URL for consistency
const API_BASE_URL = 'http://192.168.18.250:8000/web/api/v1';

// Helper to get the full API endpoint URL
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to prevent double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  statusText: string;
}

export async function fetchFromApi<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const method = options.method || 'GET';
  const url = getApiUrl(endpoint);
  
  console.log('📡 API Request:', {
    url,
    method,
    endpoint,
    baseUrl: API_BASE_URL,
    isServer: typeof window === 'undefined',
    timestamp: new Date().toISOString()
  });
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Get the authorization header if it exists
  let authHeader: string | null = null;
  try {
    authHeader = typeof window === 'undefined' 
      ? headers().get('Authorization')
      : localStorage.getItem('token');
      
    if (authHeader && !authHeader.startsWith('Bearer ')) {
      authHeader = `Bearer ${authHeader}`;
    }
  } catch (error) {
    console.warn('⚠️ Failed to get auth token:', error);
  }
  
  if (authHeader) {
    defaultHeaders['Authorization'] = authHeader;
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      credentials: 'include', // Include cookies in CORS requests
    });

    const responseTime = Date.now() - startTime;
    const responseData = await parseResponse(response);
    
    console.log(`✅ API Response [${method} ${endpoint}]:`, {
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      data: responseData,
    });

    if (!response.ok) {
      const errorMessage = responseData?.message || response.statusText || 'Unknown error';
      console.error(`❌ API Error [${response.status}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error('❌ API Request Failed:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500,
      statusText: 'Internal Server Error',
    };
  }
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      return null;
    }
  }
  
  return response.text();
}
