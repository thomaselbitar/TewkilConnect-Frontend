import { Video } from 'expo-av';

/**
 * Detects video dimensions and returns aspect ratio information
 * @param {string|object} videoSource - Video URL or source object
 * @returns {Promise<{width: number, height: number, aspectRatio: string}>}
 */
export const detectVideoDimensions = async (videoSource) => {
  try {
    // Create a temporary video ref to get dimensions
    const videoRef = { current: null };
    
    // Load the video without playing it
    const { sound, status } = await Video.Sound.createAsync(
      typeof videoSource === 'string' ? { uri: videoSource } : videoSource,
      { shouldPlay: false }
    );
    
    // Get video dimensions from status
    if (status && status.naturalSize) {
      const { width, height } = status.naturalSize;
      
      // Determine aspect ratio
      let aspectRatio = 'square';
      if (height > width) {
        aspectRatio = 'vertical';
      } else if (width > height) {
        aspectRatio = 'horizontal';
      }
      
      // Clean up
      await sound.unloadAsync();
      
      return {
        width,
        height,
        aspectRatio
      };
    }
    
    // Clean up if no dimensions found
    await sound.unloadAsync();
    return { width: 0, height: 0, aspectRatio: 'square' };
    
  } catch (error) {
    console.warn('Error detecting video dimensions:', error);
    return { width: 0, height: 0, aspectRatio: 'square' };
  }
};

/**
 * Processes an array of posts and adds video dimensions to video media
 * @param {Array} posts - Array of post objects
 * @returns {Promise<Array>} - Posts with video dimensions added
 */
export const processPostsWithVideoDimensions = async (posts) => {
  if (!posts || !Array.isArray(posts)) {
    return posts;
  }

  const processedPosts = await Promise.all(
    posts.map(async (post) => {
      if (!post.media || !Array.isArray(post.media)) {
        return post;
      }

      const processedMedia = await Promise.all(
        post.media.map(async (mediaItem) => {
          if (mediaItem.type === 'video' && mediaItem.url) {
            try {
              const dimensions = await detectVideoDimensions(mediaItem.url);
              return {
                ...mediaItem,
                width: dimensions.width,
                height: dimensions.height,
                aspectRatio: dimensions.aspectRatio
              };
            } catch (error) {
              console.warn('Error processing video dimensions for:', mediaItem.url, error);
              return mediaItem;
            }
          }
          return mediaItem;
        })
      );

      return {
        ...post,
        media: processedMedia
      };
    })
  );

  return processedPosts;
};

/**
 * Quick aspect ratio detection for local videos based on filename
 * @param {string} videoUrl - Video URL or filename
 * @returns {string} - Aspect ratio ('vertical', 'horizontal', 'square')
 */
export const getLocalVideoAspectRatio = (videoUrl) => {
  if (!videoUrl) return 'square';
  
  const urlString = videoUrl.toString();
  if (urlString.includes('v1.mp4')) return 'vertical';
  if (urlString.includes('v4.mp4')) return 'horizontal';
  if (urlString.includes('v8.mp4')) return 'square';
  
  return 'square';
};

/**
 * Helper function to process any data source that contains posts
 * Use this when you have posts from local data, API, or any other source
 * @param {Array} data - Array of posts from any source
 * @returns {Promise<Array>} - Processed posts with video dimensions
 */
export const processAnyPostsData = async (data) => {
  if (!data || !Array.isArray(data)) {
    return data;
  }

  // Check if this looks like posts data (has media property)
  const isPostsData = data.some(item => item.media && Array.isArray(item.media));
  
  if (isPostsData) {
    return await processPostsWithVideoDimensions(data);
  }
  
  return data;
};
