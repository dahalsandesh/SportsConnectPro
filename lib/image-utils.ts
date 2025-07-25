const API_BASE_URL = 'http://192.168.18.250:8000';

/**
 * Constructs a proper image URL from the backend response
 * @param {string} imagePath - The image path from the API response
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, ensure it's using the correct base
  if (imagePath.startsWith('http')) {
    // Replace any localhost or 127.0.0.1 with the correct IP
    const url = new URL(imagePath);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      // Use the API URL from environment
      url.hostname = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).hostname : url.hostname;
      url.hostname = '192.168.18.250';
      url.port = '8000';
      return url.toString();
    }
    return imagePath;
  }
  
  // Remove any leading slashes to prevent double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // If it's a path containing 'media', use it as is
  if (cleanPath.includes('media/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // Default case: assume it's in the media directory
  return `${API_BASE_URL}/media/${cleanPath}`;
};

/**
 * Gets the base URL for media files
 */
export const getMediaBaseUrl = (): string => {
  return `${API_BASE_URL}/media/`;
};
