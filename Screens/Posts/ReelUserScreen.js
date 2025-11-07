import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getLocalVideoAspectRatio } from '../../utils/videoUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  }
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}


const ReelUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { tReelScreen, tPosts, tCommon } = useTranslation();

  const {
    videoSource,
    caption = '',
    timestamp,
    user = {},
    likesCount = 0,
    post, // The full post object for deletion
    onDelete, // Callback function for deletion
  } = route.params || {};

  // User info fallback
  const firstName = typeof user.firstName === 'string' ? user.firstName : 'User';
  const lastName = typeof user.lastName === 'string' ? user.lastName : '';
  const profileImage = user.profileImage
    ? (typeof user.profileImage === 'string' ? { uri: user.profileImage } : user.profileImage)
    : require('../../assets/images/Profile/defaultProfile.jpg');
  const userType = user.userType || 'user';
  const borderColor = userType === 'provider' ? 'green' : '#007bff';

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [showOptions, setShowOptions] = useState(false);
  const videoRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  // Helper function to determine video aspect ratio for ReelUserScreen
  const getVideoAspectRatio = (videoSource) => {
    if (!videoSource) return 'vertical'; // Default to vertical for reels
    
    // If video has aspectRatio property (from backend processing), use it
    if (route.params?.aspectRatio) {
      return route.params.aspectRatio;
    }
    
    // For local videos, use filename detection
    const urlString = videoSource.toString();
    if (urlString.includes('v1.mp4')) return 'vertical'; // Story style
    if (urlString.includes('v4.mp4')) return 'horizontal'; // Landscape
    if (urlString.includes('v8.mp4')) return 'square'; // Square
    
    return 'vertical'; // Default to vertical for reels
  };

  useFocusEffect(
    React.useCallback(() => {
      // When screen is focused, do nothing
  
      return () => {
        // When screen is unfocused (e.g., swipe back), pause video
        if (videoRef.current) {
          videoRef.current.pauseAsync().catch((e) => {
            console.warn('Error pausing video on unfocus:', e);
          });
        }
      };
    }, [])
  );

  // Set timeout for loading - if spinner shows for too long, show refresh button
  React.useEffect(() => {
    if (isLoading && !isVideoReady) {
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading && !isVideoReady) {
          setVideoError(true);
          setIsLoading(false);
        }
      }, 15000); // 15 seconds timeout
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, isVideoReady]);

  if (!videoSource) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{tReelScreen('videoNotFound')}</Text>
      </View>
    );
  }


  const handleLikePress = () => {
    // Navigate to likes list like in PostUserCard
    navigation.navigate('LikesUserScreen', {
      postId: post.id,
      likesCount: likeCount,
    });
  };

  const handleDeletePost = () => {
    setShowOptions(false);
    Alert.alert(
      tPosts('deletePost'),
      tPosts('deletePostConfirm'),
      [
        { text: tCommon('cancel'), style: 'cancel' },
        {
          text: tCommon('delete'),
          style: 'destructive',
          onPress: () => {
            // Call the delete callback if provided
            if (onDelete && post) {
              onDelete(post);
            }
            // Navigate back after deletion
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRefreshVideo = async () => {
    try {
      // Clear timeout first
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // Reset to loading state
      setVideoError(false);
      setIsLoading(true);
      setIsVideoReady(false);
      setIsPlaying(false); // ensure play icon shows after retry

      if (videoRef.current) {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync(
          typeof videoSource === 'string' ? { uri: videoSource } : videoSource,
          {},
          false // load but don't auto-play
        );
      }
    } catch (error) {
      console.warn('Error refreshing video:', error);
      setVideoError(true);
      setIsLoading(false);
    }
  };

  const handleTap = () => {
    if (isLoading || videoError) {
      return; // 🔒 Don't allow play/pause while loading or error
    }

    // Single tap: toggle play/pause
    setIsPlaying((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          try {
            if (videoRef.current) {
              await videoRef.current.pauseAsync(); // ⏸ Pause the video
            }
          } catch (e) {
            console.warn('Error pausing video before going back:', e);
          }
          navigation.goBack(); // ⬅ Then navigate back
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Video area with tap handlers */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.videoContainer}>
          {isLoading && !videoError && (
            <View style={styles.spinnerOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {videoError && (
            <View style={styles.errorOverlay}>
              <Ionicons name="videocam-off" size={48} color="#fff" style={styles.errorIcon} />
              <Text style={styles.errorText}>{tReelScreen('videoFailedToLoad')}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshVideo}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.refreshButtonText}>{tReelScreen('retry')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Video
            ref={videoRef}
            source={typeof videoSource === 'string' ? { uri: videoSource } : videoSource}
            style={[
              styles.video,
              // Apply styling based on video aspect ratio for ReelUserScreen
              (() => {
                const aspectRatio = getVideoAspectRatio(videoSource);
                switch (aspectRatio) {
                  case 'square':
                    return styles.squareVideo; // Add borders top/bottom
                  case 'horizontal':
                    return styles.horizontalVideo; // Add borders top/bottom
                  case 'vertical':
                  default:
                    return styles.verticalVideo; // No borders (story style)
                }
              })()
            ]}
            resizeMode={
              (() => {
                const aspectRatio = getVideoAspectRatio(videoSource);
                switch (aspectRatio) {
                  case 'square':
                  case 'horizontal':
                    return 'contain'; // Show full video with borders
                  case 'vertical':
                  default:
                    return 'cover'; // Fill screen (story style)
                }
              })()
            }
            shouldPlay={isPlaying}
            isLooping
            isMuted={isMuted}
            useNativeControls={false}
            onReadyForDisplay={() => {
              // Clear timeout first, then update loading state
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
              }
              setIsVideoReady(true);
              setIsLoading(false);
            }}
            onPlaybackStatusUpdate={(status) => {
              // Clear spinner + error once video plays
              if (status.isPlaying) {
                setIsLoading(false);
                setVideoError(false);
                if (!isPlaying) setIsPlaying(true);
              }

              // Hide spinner when buffering stops
              if (status.isBuffering === false) {
                setIsLoading(false);
              }

              // Reset if finished
              if (status.didJustFinish) {
                setIsPlaying(false); // set to paused when finished
              }
            }}
            onError={() => {
              // Clear timeout first, then update error state
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
              }
              setVideoError(true);
              setIsLoading(false);
            }}
          />


          {/* Play icon when paused and not loading/error */}
          {!isPlaying && isVideoReady && !videoError && !isLoading && (
            <View style={styles.playOverlay} pointerEvents="none">
              <Ionicons name="play" size={60} color="#fff" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Right side icons: like, options, mute */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLikePress}>
          <Ionicons name="heart-outline" size={32} color="#fff" />
          <Text style={styles.iconLabel}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-vertical" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => setIsMuted((prev) => !prev)}>
          <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Caption and user info at bottom left */}
      <View style={styles.captionContainer}>
        <View style={styles.userRow}>
          <Image source={profileImage} style={[styles.profileImage, { borderColor }]} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.username}>{firstName} {lastName}</Text>
            </View>
            <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
          </View>
        </View>
        {caption ? <Text style={styles.captionText}>{caption}</Text> : null}
      </View>

      {/* Options modal - Only shows delete option for user's own posts */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
            
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleDeletePost}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: theme.error }]}>
                {tPosts('deletePost')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glass-like background
    backdropFilter: 'blur(10px)', // This will work on web, for mobile we use opacity
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  refreshButtonText: {
    color: '#fff', // Changed to white
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Darker text shadow for white text
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glass-like background
    backdropFilter: 'blur(10px)', // This will work on web, for mobile we use opacity
    borderRadius: 25, // Make it perfectly circular (half of width/height)
    width: 50, // Fixed width
    height: 50, // Fixed height
    justifyContent: 'center', // Center the icon
    alignItems: 'center', // Center the icon
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  videoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width,
    height,
  },
  // Video aspect ratio styles for ReelUserScreen
  verticalVideo: {
    // No special styling - fills the screen (story style)
  },
  squareVideo: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalVideo: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorIcon: {
    marginBottom: 16,
  },
  playOverlay: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 15,
  },
  rightIcons: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    alignItems: 'center',
    zIndex: 20,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  captionContainer: {
    position: 'absolute',
    left: 16,
    bottom: 40,
    right: 120,
    zIndex: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    marginRight: 10, // Add space between name and follow button
  },
  timestamp: {
    color: '#ddd',
    fontSize: 13,
  },
  captionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 32,
    paddingTop: 12,
    paddingHorizontal: 0,
    maxHeight: 200,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ReelUserScreen;
