// components/Card/PostCards/PostUserCard.jsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getLocalVideoAspectRatio } from '../../../utils/videoUtils';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const { width } = Dimensions.get('window');

/** ----------------------------------------------------------------
 * Lightweight global bus so only one video plays at a time and
 * to pause videos when the parent ScrollView is scrolling.
 * ---------------------------------------------------------------- */
const VideoControlBus = (() => {
  const listeners = new Set();
  return {
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    playRequested(id) {
      listeners.forEach((cb) => cb({ type: 'PLAY_REQUESTED', id }));
    },
    pauseAll(reason = 'GLOBAL') {
      listeners.forEach((cb) => cb({ type: 'PAUSE_ALL', reason }));
    },
  };
})();

const PostUserCard = ({
  post,
  likesCount,
  onDelete,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // --- VIDEO STATE (no autoplay) ---
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStatus, setVideoStatus] = useState({});
  const videoRef = useRef(null);
  const manualPauseRef = useRef(true); // start paused
  const isVideoPlayingRef = useRef(false);

  const { theme } = useTheme();
  const { tPosts, tCommon, tTags } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Loading + error per media index
  const [mediaLoadingStates, setMediaLoadingStates] = useState({});
  const [mediaErrorStates, setMediaErrorStates] = useState({});
  const loadingTimeoutRefs = useRef({});

  // Init media states
  useEffect(() => {
    if (post.media) {
      const initLoad = {};
      const initErr = {};
      post.media.forEach((_, i) => {
        initLoad[i] = true;
        initErr[i] = false;
      });
      setMediaLoadingStates(initLoad);
      setMediaErrorStates(initErr);
    }
  }, [post.media]);

  // Timeout for slow loads -> show retry
  useEffect(() => {
    if (!post.media) return;
    post.media.forEach((_, i) => {
      if (loadingTimeoutRefs.current[i]) {
        clearTimeout(loadingTimeoutRefs.current[i]);
        loadingTimeoutRefs.current[i] = null;
      }
      if (mediaLoadingStates[i] && !mediaErrorStates[i]) {
        loadingTimeoutRefs.current[i] = setTimeout(() => {
          setMediaLoadingStates((prev) => {
            if (prev[i]) {
              setMediaErrorStates((e) => ({ ...e, [i]: true }));
              return { ...prev, [i]: false };
            }
            return prev;
          });
        }, 15000);
      }
    });
    return () => {
      Object.values(loadingTimeoutRefs.current).forEach((t) => t && clearTimeout(t));
    };
  }, [mediaLoadingStates, mediaErrorStates, post.media]);

  // Listen to global bus
  useEffect(() => {
    const unsub = VideoControlBus.subscribe(async (evt) => {
      if (!videoRef.current) return;

      if (evt.type === 'PAUSE_ALL') {
        // Pause if playing
        if (isVideoPlayingRef.current) {
          try {
            await videoRef.current.pauseAsync();
          } catch {}
          isVideoPlayingRef.current = false;
          setIsVideoPlaying(false);
          manualPauseRef.current = true;
        }
      }

      if (evt.type === 'PLAY_REQUESTED') {
        // If another card requested play, pause this one
        if (evt.id !== post.id && isVideoPlayingRef.current) {
          try {
            await videoRef.current.pauseAsync();
          } catch {}
          isVideoPlayingRef.current = false;
          setIsVideoPlaying(false);
          manualPauseRef.current = true;
        }
      }
    });
    return unsub;
  }, [post.id]);

  // Pause if screen loses focus (navigating away)
  useEffect(() => {
    if (!isFocused && isVideoPlayingRef.current && videoRef.current) {
      (async () => {
        try {
          await videoRef.current.pauseAsync();
        } catch {}
        isVideoPlayingRef.current = false;
        setIsVideoPlaying(false);
        manualPauseRef.current = true;
      })();
    }
  }, [isFocused]);

  const handleRefreshMedia = async (index) => {
    try {
      setMediaErrorStates((prev) => ({ ...prev, [index]: false }));
      setMediaLoadingStates((prev) => ({ ...prev, [index]: true }));

      if (post.media[index].type === 'video' && videoRef.current) {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync(
          typeof post.media[index].url === 'string'
            ? { uri: post.media[index].url }
            : post.media[index].url,
          {},
          false
        );
      }
    } catch (error) {
      setMediaErrorStates((prev) => ({ ...prev, [index]: true }));
      setMediaLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // TAP to toggle play/pause (no autoplay)
  const handleTap = async () => {
    // Only if a video post
    const isVideoPost = post.media && post.media.length === 1 && post.media[0].type === 'video';
    if (!isVideoPost || mediaLoadingStates[0] || mediaErrorStates[0] || !videoRef.current) return;

    const wantPlay = !isVideoPlayingRef.current;
    try {
      if (wantPlay) {
        // Broadcast to pause others
        VideoControlBus.playRequested(post.id);
        await videoRef.current.playAsync();
        manualPauseRef.current = false;
        isVideoPlayingRef.current = true;
        setIsVideoPlaying(true);
      } else {
        await videoRef.current.pauseAsync();
        manualPauseRef.current = true;
        isVideoPlayingRef.current = false;
        setIsVideoPlaying(false);
      }
    } catch (e) {
      // swallow
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
  
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
  
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    }
  
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
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
                <TouchableOpacity style={styles.refreshButton} onPress={() => handleRefreshMedia(index)}>
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
                if (loadingTimeoutRefs.current[index]) {
                  clearTimeout(loadingTimeoutRefs.current[index]);
                  loadingTimeoutRefs.current[index] = null;
                }
                setMediaLoadingStates((prev) => ({ ...prev, [index]: false }));
                setMediaErrorStates((prev) => ({ ...prev, [index]: false }));
              }}
              onError={() => {
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

  const getVideoAspectRatio = (videoUrl) => {
    if (!videoUrl) return 'square';
    if (post.media[0].aspectRatio) return post.media[0].aspectRatio;
    return getLocalVideoAspectRatio(videoUrl);
  };

  const handleDeletePost = () => {
    setShowDropdown(false);
    Alert.alert(
      tPosts('deletePost'),
      tPosts('deletePostConfirm'),
      [
        { text: tCommon('cancel'), style: 'cancel' },
        {
          text: tCommon('delete'),
          style: 'destructive',
          onPress: () => onDelete && onDelete(post),
        },
      ]
    );
  };

  const handleLikePress = () => {
    // Navigate to likes list
    navigation.navigate('LikesUserScreen', {
      postId: post.id,
      likesCount: likesCount,
    });
  };

  const handleFullscreen = () => {
    // Pause here so fullscreen takes over cleanly
    if (isVideoPlayingRef.current && videoRef.current) {
      videoRef.current.pauseAsync().catch(() => {});
      isVideoPlayingRef.current = false;
      setIsVideoPlaying(false);
      manualPauseRef.current = true;
    }
    navigation.navigate('ReelUserScreen', {
      videoSource: post.media[0].url,
      caption: post.caption,
      timestamp: post.timestamp,
      user: post.user,
      likesCount: post.likesCount,
      isMuted,
      aspectRatio: getVideoAspectRatio(post.media[0].url),
      post: post, // Pass the full post object for deletion
      onDelete: onDelete, // Pass the delete callback
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: theme.background, marginBottom: 0 },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
        profileImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
        userDetails: { flex: 1 },
        userName: { fontWeight: '600', fontSize: 14, color: theme.textPrimary },
        timestamp: {
          fontSize: 12,
          color: theme.textSecondary,
          marginTop: 4,
          marginLeft: 12,
          marginBottom: 12,
          textAlign: 'left',
        },
        moreButtonContainer: { position: 'relative' },
        moreButton: { padding: 4 },
        dropdownMenu: {
          position: 'absolute',
          top: 30,
          right: 0,
          backgroundColor: theme.cardBackground,
          borderRadius: 8,
          minWidth: 150,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 1000,
        },
        dropdownOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
        dropdownOptionIcon: { marginRight: 12 },
        dropdownOptionText: { fontSize: 15, fontWeight: '500' },

        mediaWrapper: { position: 'relative' },
        mediaContainer: { height: width, position: 'relative', backgroundColor: '#000' },
        mediaItemContainer: { width, height: width },
        mediaImage: { width, height: width },

        verticalVideo: { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
        horizontalVideo: { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },

        spinnerOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height: width,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        },
        errorOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height: width,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        },
        errorIcon: { marginBottom: 16 },
        errorText: { color: '#fff', fontSize: 16, marginBottom: 20, textAlign: 'center' },
        refreshButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
          marginTop: 10,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.3)',
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
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        photoCounter: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        photoCounterText: { color: 'white', fontSize: 12, fontWeight: '600' },

        videoContainer: { position: 'relative' },
        playButton: { position: 'absolute', top: '45%', left: '45%', zIndex: 10 },

        actions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, paddingVertical: 6, marginLeft: 0 },
        likeButton: { 
          flexDirection: 'row', 
          alignItems: 'center', 
          padding: 4,
       
          marginLeft: 12,
        },
        likesCount: { 
          fontWeight: '600', 
          fontSize: 14, 
          marginLeft: 4,
        },

        captionContainer: { paddingHorizontal: 0, paddingBottom: 4, marginLeft: 12, marginRight: 12 },
        caption: { fontSize: 14, color: theme.textPrimary, lineHeight: 18 },
        tagsContainer: { paddingHorizontal: 0, paddingBottom: 4, marginLeft: 12, marginRight: 12 },
        tagsText: { fontSize: 14, color: '#007AFF', lineHeight: 18 },

        fullscreenIcon: {
          position: 'absolute',
          left: 12,
          bottom: 12,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.3)',
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
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.3)',
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
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          minWidth: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.3)',
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
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
      }),
    [theme]
  );

  return (
    <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
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
          <View style={styles.moreButtonContainer}>
            <TouchableOpacity style={styles.moreButton} onPress={() => setShowDropdown(!showDropdown)}>
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.textPrimary} />
            </TouchableOpacity>

            {showDropdown && (
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity style={styles.dropdownOption} onPress={handleDeletePost} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={20} color={theme.error} style={styles.dropdownOptionIcon} />
                    <Text style={[styles.dropdownOptionText, { color: theme.error }]}>
                      {tPosts('deletePost')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            )}
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
                      const ar = getVideoAspectRatio(post.media[0].url);
                      switch (ar) {
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
                  /** NO AUTOPLAY */
                  shouldPlay={isVideoPlaying}
                  isLooping
                  isMuted={isMuted}
                  useNativeControls={false}
                  onReadyForDisplay={() => {
                    if (loadingTimeoutRefs.current[0]) {
                      clearTimeout(loadingTimeoutRefs.current[0]);
                      loadingTimeoutRefs.current[0] = null;
                    }
                    setMediaLoadingStates((p) => ({ ...p, [0]: false }));
                    setMediaErrorStates((p) => ({ ...p, [0]: false }));
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    setVideoStatus(status);

                    if (status.isPlaying && !isVideoPlayingRef.current) {
                      isVideoPlayingRef.current = true;
                      setIsVideoPlaying(true);
                      manualPauseRef.current = false;
                    }
                    if (!status.isPlaying && isVideoPlayingRef.current && !status.isBuffering) {
                      // paused or stopped
                      isVideoPlayingRef.current = false;
                      setIsVideoPlaying(false);
                    }
                    if (status.didJustFinish) {
                      isVideoPlayingRef.current = false;
                      setIsVideoPlaying(false);
                      manualPauseRef.current = true;
                    }
                    // Stop spinner when buffering ends
                    if (status.isBuffering === false) {
                      setMediaLoadingStates((p) => ({ ...p, [0]: false }));
                    }
                  }}
                  onError={() => {
                    if (loadingTimeoutRefs.current[0]) {
                      clearTimeout(loadingTimeoutRefs.current[0]);
                      loadingTimeoutRefs.current[0] = null;
                    }
                    setMediaErrorStates((p) => ({ ...p, [0]: true }));
                    setMediaLoadingStates((p) => ({ ...p, [0]: false }));
                    isVideoPlayingRef.current = false;
                    setIsVideoPlaying(false);
                    manualPauseRef.current = true;
                  }}
                />

                {/* Play icon overlay when paused and not loading/error */}
                {!isVideoPlaying && !mediaLoadingStates[0] && !mediaErrorStates[0] && (
                  <View style={styles.playButton} pointerEvents="none">
                    <Ionicons name="play" size={48} color="#fff" />
                  </View>
                )}

                {/* Fullscreen (bottom-left) */}
                <TouchableOpacity style={styles.fullscreenIcon} onPress={handleFullscreen} activeOpacity={0.7}>
                  <Ionicons name="expand" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Mute/Unmute (bottom-right) */}
                <TouchableOpacity
                  style={styles.muteIcon}
                  onPress={() => setIsMuted((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={24} color="#fff" />
                </TouchableOpacity>

                {/* Time remaining (top-right) */}
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
              <ScrollView
                horizontal={post.media.length > 1}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={post.media.length > 1}
                style={styles.mediaContainer}
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                  setCurrentPhotoIndex(idx);
                }}
              >
                {post.media.map((item, index) => (
                  <View key={index} style={styles.mediaItemContainer}>
                    {renderMediaItem({ item, index })}
                  </View>
                ))}
              </ScrollView>
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
          <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
            <Ionicons
              name="heart-outline"
              size={24}
              color={theme.textPrimary}
            />
            <Text style={[styles.likesCount, { color: theme.textPrimary }]}>{likesCount.toLocaleString()}</Text>
          </TouchableOpacity>
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PostUserCard;

/** Export the bus to use in Profile to pause on scroll */
export const __VideoControlBus = {
  pauseAll: VideoControlBus.pauseAll,
};
