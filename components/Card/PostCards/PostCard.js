import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../../../utils/helpers';
import { Video } from 'expo-av';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getLocalVideoAspectRatio } from '../../../utils/videoUtils';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const { width } = Dimensions.get('window');

// Helper to detect iPhone (not iPad)
const isIphone =
  Platform.OS === 'ios' &&
  (Dimensions.get('window').height < 812 || Dimensions.get('window').width < 812);

const PostCard = ({
  post,
  isActive,
  isLiked,
  likesCount,
  onLikeToggle,
  isFollowed = false,
  onFollowToggle,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStatus, setVideoStatus] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const [lastTap, setLastTap] = useState(null);
  const DOUBLE_TAP_DELAY = 300;
  const singleTapTimeout = useRef(null);
  const { theme } = useTheme();
  const { tPosts, tTags } = useTranslation();

  // Add local follow state management
  const [localIsFollowed, setLocalIsFollowed] = useState(isFollowed);

  // Update local follow state when prop changes
  React.useEffect(() => {
    setLocalIsFollowed(isFollowed);
  }, [isFollowed]);

  // Handle follow toggle
  const handleFollowToggle = () => {
    setLocalIsFollowed((prev) => !prev);
    if (onFollowToggle) {
      onFollowToggle();
    }
  };

  // Heart animation state
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);

  // Loading and error states for media
  const [mediaLoadingStates, setMediaLoadingStates] = useState({});
  const [mediaErrorStates, setMediaErrorStates] = useState({});
  const loadingTimeoutRefs = useRef({});

  // Add a ref to track if we're currently seeking
  const isSeekingRef = useRef(false);
  const seekTimeoutRef = useRef(null);
  const manualPauseRef = useRef(false); // Track manual pause state

  // Get media types for the current post
  const mediaTypes = post.media ? post.media.map((item) => item.type) : [];

  // Initialize loading states for all media items
  React.useEffect(() => {
    if (post.media) {
      const initialLoadingStates = {};
      const initialErrorStates = {};
      post.media.forEach((item, index) => {
        initialLoadingStates[index] = true;
        initialErrorStates[index] = false;
      });
      setMediaLoadingStates(initialLoadingStates);
      setMediaErrorStates(initialErrorStates);
    }
  }, [post.media]);

  // Set timeout for loading - if spinner shows for too long, show refresh button
  React.useEffect(() => {
    if (post.media) {
      post.media.forEach((item, index) => {
        // Clear existing timeout for this index
        if (loadingTimeoutRefs.current[index]) {
          clearTimeout(loadingTimeoutRefs.current[index]);
          loadingTimeoutRefs.current[index] = null;
        }

        // Only set new timeout if currently loading and not in error state
        if (mediaLoadingStates[index] && !mediaErrorStates[index]) {
          loadingTimeoutRefs.current[index] = setTimeout(() => {
            // Double check that we're still loading before setting error
            setMediaLoadingStates((prev) => {
              if (prev[index]) {
                setMediaErrorStates((prevError) => ({ ...prevError, [index]: true }));
                return { ...prev, [index]: false };
              }
              return prev;
            });
          }, 15000); // 15 seconds timeout
        }
      });
    }

    return () => {
      Object.values(loadingTimeoutRefs.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [mediaLoadingStates, mediaErrorStates, post.media]);

  // Consolidated video playback management with better error handling
  React.useEffect(() => {
    const manageVideoPlayback = async () => {
      if (!post.media || post.media[0].type !== 'video' || !videoRef.current) {
        return;
      }

      try {
        // If user manually paused, don't auto-play even if active
        const shouldPlay =
          isActive &&
          isFocused &&
          !mediaLoadingStates[0] &&
          !mediaErrorStates[0] &&
          !manualPauseRef.current;

        if (shouldPlay) {
          // Should play video
          if (!isVideoPlaying) {
            await videoRef.current.playAsync();
            setIsVideoPlaying(true);
          }
        } else {
          // Should pause video
          if (isVideoPlaying) {
            await videoRef.current.pauseAsync();
            setIsVideoPlaying(false);
          }

          // Reset to beginning if not active, but only if not currently seeking
          if (!isActive && !isSeekingRef.current) {
            // Clear any existing seek timeout
            if (seekTimeoutRef.current) {
              clearTimeout(seekTimeoutRef.current);
            }

            // Add a small delay to avoid rapid seeking during scroll
            seekTimeoutRef.current = setTimeout(async () => {
              try {
                isSeekingRef.current = true;
                await videoRef.current.setPositionAsync(0);
              } catch (seekError) {
                // Only log if it's not a seeking interrupted error
                if (!String(seekError).includes('Seeking interrupted')) {
                  console.warn('Error seeking video:', seekError);
                }
              } finally {
                isSeekingRef.current = false;
              }
            }, 100); // 100ms delay
          }
        }
      } catch (e) {
        // Only log if it's not a seeking interrupted error
        if (!String(e).includes('Seeking interrupted')) {
          console.warn('Error managing video playback:', e);
        }
        setIsVideoPlaying(false);
      }
    };

    manageVideoPlayback();

    // Cleanup function to clear timeouts
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, [isActive, isFocused, mediaLoadingStates, mediaErrorStates, post.media, isVideoPlaying]);

  // Reset manual pause when post becomes active again
  React.useEffect(() => {
    if (isActive) {
      manualPauseRef.current = false;
    }
  }, [isActive]);

  const handleRefreshMedia = async (index) => {
    try {
      // Reset to loading state
      setMediaErrorStates((prev) => ({ ...prev, [index]: false }));
      setMediaLoadingStates((prev) => ({ ...prev, [index]: true }));
      setIsVideoPlaying(false); // ensure play icon shows after retry

      if (post.media[index].type === 'video' && videoRef.current) {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync(
          typeof post.media[index].url === 'string'
            ? { uri: post.media[index].url }
            : post.media[index].url,
          {},
          false, // load but don't auto-play
        );
      }
    } catch (error) {
      console.warn('Error refreshing media:', error);
      setMediaErrorStates((prev) => ({ ...prev, [index]: true }));
      setMediaLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleFullscreen = () => {
    setIsVideoPlaying(false);
    navigation.navigate('ReelScreen', {
      videoSource: post.media[0].url,
      caption: post.caption,
      timestamp: post.timestamp,
      user: post.user,
      isLiked: post.isLiked,
      likesCount: post.likesCount,
      isFollowed: localIsFollowed, // Use local state instead of prop
      isMuted,
      aspectRatio: getVideoAspectRatio(post.media[0].url), // Pass aspect ratio
    });
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap: like
      if (!isLiked) {
        onLikeToggle();
      }
      if (!isAnimatingHeart) {
        setIsAnimatingHeart(true);
        setShowHeart(true);
        heartScale.setValue(0.5);
        heartOpacity.setValue(1);
        Animated.sequence([
          Animated.spring(heartScale, {
            toValue: 1.5,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowHeart(false);
          setIsAnimatingHeart(false);
        });
      }
      // Clear single tap timeout if exists
      if (singleTapTimeout.current) {
        clearTimeout(singleTapTimeout.current);
        singleTapTimeout.current = null;
      }
    } else {
      // Single tap: wait to see if double tap
      singleTapTimeout.current = setTimeout(() => {
        // Only toggle video if not loading and not in error state
        if (!mediaLoadingStates[0] && !mediaErrorStates[0]) {
          const newPlayingState = !isVideoPlaying;

          // Update manual pause flag
          if (!newPlayingState) {
            manualPauseRef.current = true; // User manually paused
          } else {
            manualPauseRef.current = false; // User manually played
          }

          setIsVideoPlaying(newPlayingState);
        }
        singleTapTimeout.current = null;
      }, DOUBLE_TAP_DELAY);
    }
    setLastTap(now);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInMinutes < 60) return `${diffInMinutes}${tPosts('timeAgo.minutes')}`;
    if (diffInHours < 24) return `${diffInHours}${tPosts('timeAgo.hours')}`;
    if (diffInDays < 7) return `${diffInDays}${tPosts('timeAgo.days')}`;
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    }
    return `${date.getDate()} ${date.toLocaleString('default', {
      month: 'short',
    })} ${date.getFullYear()}`;
  };

  const formatDuration = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderMediaItem = ({ item, index }) => {
    if (item.type === 'image') {
      return (
        <TouchableWithoutFeedback onPress={handleTap}>
          <View style={styles.mediaContainer}>
            {mediaLoadingStates[index] && !mediaErrorStates[index] && (
              <View style={styles.spinnerOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            {mediaErrorStates[index] && (
              <View style={styles.errorOverlay}>
                <Ionicons name="image" size={48} color="#fff" style={styles.errorIcon} />
                <Text style={styles.errorText}>{tPosts('imageFailedToLoad')}</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={() => handleRefreshMedia(index)}
                >
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.refreshButtonText}>{tPosts('retry')}</Text>
                </TouchableOpacity>
              </View>
            )}
            <Image
              source={item.url}
              style={styles.mediaImage}
              resizeMode="cover"
              onLoad={() => {
                // Clear timeout first, then update loading state
                if (loadingTimeoutRefs.current[index]) {
                  clearTimeout(loadingTimeoutRefs.current[index]);
                  loadingTimeoutRefs.current[index] = null;
                }
                setMediaLoadingStates((prev) => ({ ...prev, [index]: false }));
                setMediaErrorStates((prev) => ({ ...prev, [index]: false }));
              }}
              onError={() => {
                // Clear timeout first, then update error state
                if (loadingTimeoutRefs.current[index]) {
                  clearTimeout(loadingTimeoutRefs.current[index]);
                  loadingTimeoutRefs.current[index] = null;
                }
                setMediaErrorStates((prev) => ({ ...prev, [index]: true }));
                setMediaLoadingStates((prev) => ({ ...prev, [index]: false }));
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  };

  const isVideoPost = post.media && post.media.length === 1 && post.media[0].type === 'video';

  // Helper function to determine video aspect ratio
  const getVideoAspectRatio = (videoUrl) => {
    if (!videoUrl) return 'square';

    // If video has aspectRatio property (from backend processing), use it
    if (post.media[0].aspectRatio) {
      return post.media[0].aspectRatio;
    }

    // For local videos, use filename detection
    return getLocalVideoAspectRatio(videoUrl);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.background,
          marginBottom: 0,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        userInfo: {
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        },
        profileImage: {
          width: 32,
          height: 32,
          borderRadius: 16,
          marginRight: 8,
        },
        userDetails: {
          flex: 1,
        },
        userName: {
          fontWeight: '600',
          fontSize: 14,
          color: theme.textPrimary,
        },
        timestamp: {
          fontSize: 12,
          color: theme.textSecondary,
          marginTop: 4,
          marginLeft: 12,
          marginBottom: 12,
          textAlign: 'left',
        },
        moreButton: {
          padding: 4,
        },
        mediaWrapper: {
          position: 'relative',
        },
        mediaContainer: {
          height: width, // Square aspect ratio
          position: 'relative',
          backgroundColor: '#000', // keep black for media letterboxing
        },
        mediaImage: {
          width: width,
          height: width,
        },
        verticalVideo: {
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
          width: width,
          height: width,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        },
        errorOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: width,
          height: width,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        },
        errorIcon: {
          marginBottom: 16,
        },
        errorText: {
          color: '#fff',
          fontSize: 16,
          marginBottom: 20,
          textAlign: 'center',
        },
        refreshButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glass-like background
          backdropFilter: 'blur(10px)', // web only; mobile uses opacity
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
          marginTop: 10,
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle border
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        refreshButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
          marginLeft: 8,
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        photoCounter: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        photoCounterText: {
          color: 'white',
          fontSize: 12,
          fontWeight: '600',
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        videoContainer: { position: 'relative' },
        playButton: {
          position: 'absolute',
          top: '45%',
          left: '45%',
          zIndex: 10,
        },
        actions: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 0,
          paddingVertical: 6,
          marginLeft: 12,
        },
        actionButton: { padding: 4 },
        likesCount: {
          fontWeight: '600',
          fontSize: 14,
          color: theme.textPrimary,
        },
        captionContainer: {
          paddingHorizontal: 0,
          paddingBottom: 4,
          marginLeft: 12,
          marginRight: 12,
        },
        caption: {
          fontSize: 14,
          color: theme.textPrimary,
          lineHeight: 18,
        },
        tagsContainer: {
          paddingHorizontal: 0,
          paddingBottom: 4,
          marginLeft: 12,
          marginRight: 12,
        },
        tagsText: {
          fontSize: 14,
          color: '#007AFF',
          lineHeight: 18,
        },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'stretch',
        },
        optionsContainer: {
          backgroundColor: theme.cardBackground,
          borderRadius: 12,
          width: '80%',
          maxWidth: 300,
        },
        optionButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
        },
        optionIcon: { marginRight: 12 },
        optionText: {
          fontSize: 16,
          color: theme.textPrimary,
          fontWeight: '500',
        },
        reportText: { color: theme.error },
        separator: {
          height: 0.5,
          backgroundColor: theme.border,
        },
        fullscreenIcon: {
          position: 'absolute',
          left: 12,
          bottom: 12,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        muteIcon: {
          position: 'absolute',
          right: 12,
          bottom: 12,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        videoDuration: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          minWidth: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        videoDurationText: {
          color: 'white',
          fontSize: 13,
          fontWeight: '600',
          textAlign: 'center',
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        heartOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          pointerEvents: 'none',
        },
        igModalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          justifyContent: 'flex-end',
          alignItems: 'stretch',
        },
        igOptionsContainer: {
          backgroundColor: theme.cardBackground,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          paddingBottom: 32,
          paddingTop: 12,
          paddingHorizontal: 0,
          width: '100%',
          minHeight: 120,
          alignItems: 'stretch',
        },
        igHandleBar: {
          width: 40,
          height: 5,
          borderRadius: 3,
          backgroundColor: theme.textDisabled,
          alignSelf: 'center',
          marginBottom: 16,
        },
        headerActions: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        followButton: {
          backgroundColor: theme.social,
          paddingVertical: 6,
          paddingHorizontal: 16,
          borderRadius: 8,
          marginRight: 10,
          borderWidth: 0,
        },
        followButtonText: {
          color: '#ffffff',
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: post.user.profileImage }}
            style={[
              styles.profileImage,
              {
                borderColor: post.user.userType === 'provider' ? theme.success : theme.primary,
                borderWidth: 2,
              },
            ]}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {post.user.firstName} {post.user.lastName}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          {!localIsFollowed && (
            <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
              <Text style={styles.followButtonText}>{tPosts('follow')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => {
              setModalUser(`${post.user.firstName} ${post.user.lastName}`);
              setShowOptions(true);
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Media */}
      {isVideoPost ? (
        <View style={styles.mediaWrapper}>
          <TouchableWithoutFeedback onPress={handleTap}>
            <View style={styles.mediaContainer}>
              {mediaLoadingStates[0] && !mediaErrorStates[0] && (
                <View style={styles.spinnerOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              {mediaErrorStates[0] && (
                <View style={styles.errorOverlay}>
                  <Ionicons name="videocam-off" size={48} color="#fff" style={styles.errorIcon} />
                  <Text style={styles.errorText}>{tPosts('videoFailedToLoad')}</Text>
                  <TouchableOpacity style={styles.refreshButton} onPress={() => handleRefreshMedia(0)}>
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.refreshButtonText}>{tPosts('retry')}</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Video
                ref={videoRef}
                source={post.media[0].url}
                style={[
                  styles.mediaImage,
                  (() => {
                    const aspectRatio = getVideoAspectRatio(post.media[0].url);
                    switch (aspectRatio) {
                      case 'vertical':
                        return styles.verticalVideo;
                      case 'horizontal':
                        return styles.horizontalVideo;
                      case 'square':
                      default:
                        return null;
                    }
                  })(),
                ]}
                resizeMode="contain"
                shouldPlay={isVideoPlaying}
                isLooping
                isMuted={isMuted}
                useNativeControls={false}
                onReadyForDisplay={() => {
                  if (loadingTimeoutRefs.current[0]) {
                    clearTimeout(loadingTimeoutRefs.current[0]);
                    loadingTimeoutRefs.current[0] = null;
                  }
                  setMediaLoadingStates((prev) => ({ ...prev, [0]: false }));
                  setMediaErrorStates((prev) => ({ ...prev, [0]: false }));
                }}
                onPlaybackStatusUpdate={(status) => {
                  setVideoStatus(status);

                  // Clear spinner + error once video plays
                  if (status.isPlaying) {
                    if (loadingTimeoutRefs.current[0]) {
                      clearTimeout(loadingTimeoutRefs.current[0]);
                      loadingTimeoutRefs.current[0] = null;
                    }
                    setMediaLoadingStates((prev) => ({ ...prev, [0]: false }));
                    setMediaErrorStates((prev) => ({ ...prev, [0]: false }));
                    if (!isVideoPlaying) setIsVideoPlaying(true);
                  }

                  // Hide spinner when buffering stops
                  if (status.isBuffering === false) {
                    setMediaLoadingStates((prev) => ({ ...prev, [0]: false }));
                  }

                  // Reset if finished
                  if (status.didJustFinish) {
                    setIsVideoPlaying(false);
                  }
                }}
                onError={() => {
                  if (loadingTimeoutRefs.current[0]) {
                    clearTimeout(loadingTimeoutRefs.current[0]);
                    loadingTimeoutRefs.current[0] = null;
                  }
                  setMediaErrorStates((prev) => ({ ...prev, [0]: true }));
                  setMediaLoadingStates((prev) => ({ ...prev, [0]: false }));
                }}
              />
              {/* Animated Heart Overlay */}
              {showHeart && (
                <Animated.View
                  style={[
                    styles.heartOverlay,
                    {
                      opacity: heartOpacity,
                      transform: [{ scale: heartScale }],
                    },
                  ]}
                  pointerEvents="none"
                >
                  <Ionicons name="heart" size={64} color="#ff3040" />
                </Animated.View>
              )}
              {/* Play icon overlay when paused and not loading/error */}
              {!isVideoPlaying && !mediaLoadingStates[0] && !mediaErrorStates[0] && (
                <View style={styles.playButton} pointerEvents="none">
                  <Ionicons name="play" size={48} color="#fff" />
                </View>
              )}
              {/* Fullscreen icon (bottom left) */}
              <TouchableOpacity style={styles.fullscreenIcon} onPress={handleFullscreen} activeOpacity={0.7}>
                <Ionicons name="expand" size={24} color="#fff" />
              </TouchableOpacity>
              {/* Mute/Unmute icon (bottom right) */}
              <TouchableOpacity
                style={styles.muteIcon}
                onPress={() => setIsMuted((prev) => !prev)}
                activeOpacity={0.7}
              >
                <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={24} color="#fff" />
              </TouchableOpacity>
              {/* Time remaining (top right) */}
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>
                  {formatTime((videoStatus.durationMillis || 0) - (videoStatus.positionMillis || 0))}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      ) : (
        post.media &&
        post.media.length > 0 && (
          <View style={styles.mediaWrapper}>
            <FlatList
              data={post.media}
              renderItem={renderMediaItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal={post.media.length > 1}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={post.media.length > 1}
              style={styles.mediaContainer}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentPhotoIndex(index);
              }}
            />
            {/* Animated Heart Overlay for images */}
            {showHeart && (
              <Animated.View
                style={[
                  styles.heartOverlay,
                  {
                    opacity: heartOpacity,
                    transform: [{ scale: heartScale }],
                  },
                ]}
                pointerEvents="none"
              >
                <Ionicons name="heart" size={64} color="#ff3040" />
              </Animated.View>
            )}
            {post.media.length > 1 && (
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>
                  {currentPhotoIndex + 1}/{post.media.length}
                </Text>
              </View>
            )}
          </View>
        )
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLikeToggle} style={styles.actionButton}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#ff3040' : theme.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{likesCount.toLocaleString()}</Text>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={{ fontWeight: '600', color: theme.textPrimary }}>
            {post.user.firstName} {post.user.lastName}
          </Text>{' '}
          {post.caption}
        </Text>
      </View>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsText}>
            {post.tags.map((tag, index) => (
              <Text key={index}>
                #{tTags(tag)}{index < post.tags.length - 1 ? ' ' : ''}
              </Text>
            ))}
          </Text>
        </View>
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.igModalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.igOptionsContainer}>
            <View style={styles.igHandleBar} />
            {/* Show unfollow option only if already followed */}
            {localIsFollowed && (
              <>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    setShowOptions(false);
                    handleFollowToggle(); // Call the local follow toggle function
                  }}
                >
                  <Ionicons
                    name="person-remove-outline"
                    size={20}
                    color={theme.textPrimary}
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionText}>{tPosts('unfollow')} {modalUser}</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
              </>
            )}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                // Handle report logic here
                console.log('Report pressed');
              }}
            >
              <Ionicons name="flag-outline" size={20} color={theme.error} style={styles.optionIcon} />
              <Text style={[styles.optionText, styles.reportText]}>{tPosts('report')} {modalUser}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PostCard;
