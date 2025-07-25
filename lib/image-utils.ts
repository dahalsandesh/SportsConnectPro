const API_BASE_URL = 'http://192.168.18.250:8000';

/**
 * Constructs a proper image URL from the backend response
 * @param {string} imagePath - The image path from the API response
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // Handle case where the URL already contains the correct IP
  if (imagePath.includes('192.168.18.250')) {
    return imagePath;
  }
  
  // Handle localhost and 127.0.0.1 URLs
  if (imagePath.includes('localhost') || imagePath.includes('127.0.0.1')) {
    return imagePath
      .replace('http://localhost:8000', 'http://192.168.18.250:8000')
      .replace('http://127.0.0.1:8000', 'http://192.168.18.250:8000');
  }
  
  // If it's a full URL that doesn't need modification
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For relative paths
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // If it's already a full path with media
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
