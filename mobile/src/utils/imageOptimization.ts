/**
 * ImageKit Utility for Mobile App
 * Provides image optimization and transformation capabilities
 */

/**
 * Get optimized image URL with transformations
 * ImageKit allows you to transform images on-the-fly for optimal mobile performance
 * 
 * @param url - Original image URL (ImageKit or regular URL)
 * @param transformations - Transformation parameters
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  url: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'maintain_ratio' | 'force' | 'at_max' | 'at_least';
  } = {}
): string => {
  const urlEndpoint = process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  // If URL is not from ImageKit or endpoint not configured, return original
  if (!urlEndpoint || !url || !url.includes('imagekit.io')) {
    return url;
  }

  const { 
    width, 
    height, 
    quality = 80, 
    format = 'auto', 
    crop = 'maintain_ratio' 
  } = transformations;

  let transformStr = 'tr:';
  if (width) transformStr += `w-${width},`;
  if (height) transformStr += `h-${height},`;
  transformStr += `q-${quality},`;
  transformStr += `f-${format},`;
  transformStr += `c-${crop}`;

  try {
    // Extract the file path from the URL
    const filePath = url.split('imagekit.io/')[1];
    
    return `${urlEndpoint}/${transformStr}/${filePath}`;
  } catch (error) {
    console.error('Error transforming ImageKit URL:', error);
    return url; // Return original URL on error
  }
};

/**
 * Get thumbnail URL for product images
 * Optimized for list/grid views
 */
export const getProductThumbnailUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 400,
    height: 400,
    quality: 80,
    format: 'auto',
    crop: 'maintain_ratio'
  });
};

/**
 * Get full-size optimized URL for product detail view
 */
export const getProductDetailUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 800,
    height: 800,
    quality: 90,
    format: 'auto',
    crop: 'maintain_ratio'
  });
};

/**
 * Get banner/offer image URL
 */
export const getBannerImageUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 1200,
    quality: 85,
    format: 'auto',
    crop: 'at_least'
  });
};
