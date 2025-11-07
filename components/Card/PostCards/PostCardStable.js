// components/Card/PostCards/PostCardStable.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { getLocalVideoAspectRatio } from '../../../utils/videoUtils';

const { width } = Dimensions.get('window');

/* ---------------- Video Control Bus ---------------- */
const _listeners = new Set();
const _notify = (evt) => _listeners.forEach((cb) => cb?.(evt));

export const PostCardStableBus = {
  playRequested(id) { _notify({ type: 'PLAY_REQUESTED', id }); },
  pauseRequested(id) { _notify({ type: 'PAUSE_REQUESTED', id }); },
  scrolling(isScrolling) { _notify({ type: 'SCROLLING', isScrolling }); },
  subscribe(cb) { _listeners.add(cb); return () => _listeners.delete(cb); },
};

const PostCardStable = ({
  post,
  isActive,
  isLiked,
  likesCount,
  onLikeToggle,
  isFollowed = false,
  onFollowToggle,
}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const { tPosts, tTags } = useTranslation();

  // Follow (mirror)
  const [localIsFollowed, setLocalIsFollowed] = useState(isFollowed);
  useEffect(() => setLocalIsFollowed(isFollowed), [isFollowed]);
  const handleFollowToggle = () => { 
    // Only update local state immediately for follow action
    // For unfollow, let the parent handle the confirmation first
    if (localIsFollowed) {
      // This is an unfollow action - don't update local state yet
      onFollowToggle?.();
    } else {
      // This is a follow action - update immediately
      setLocalIsFollowed(true);
      onFollowToggle?.();
    }
  };

  // Media / video state
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStatus, setVideoStatus] = useState({});
  const manualPauseRef = useRef(false);
  const isSeekingRef = useRef(false);
  const seekTimeoutRef = useRef(null);

  // Debounce + throttle
  const lastToggleAtRef = useRef(0);
  const TOGGLE_DEBOUNCE = 220;
  const opInFlightRef = useRef(false);

  // Loading + error
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const loadingTimerRef = useRef(null);
  const clearLoadingTimer = () => { if (loadingTimerRef.current) { clearTimeout(loadingTimerRef.current); loadingTimerRef.current = null; } };

  // Heart overlay
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const heartAnimatingRef = useRef(false);            // NEW: guard animation storms
  const isLikeCoolingRef = useRef(false);             // NEW: throttle rapid likes

  // Modal
  const [showOptions, setShowOptions] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const isVideoPost = post?.media?.length === 1 && post.media[0]?.type === 'video';

  const getVideoAspect = (videoUrl) => {
    if (!videoUrl) return 'square';
    if (post.media?.[0]?.aspectRatio) return post.media[0].aspectRatio;
    return getLocalVideoAspectRatio(videoUrl);
  };

  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const mins = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hrs / 24);
  
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    }
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };
  

  // Init / reset loading for video
  useEffect(() => {
    if (isVideoPost) {
      setMediaLoading(true);
      setMediaError(false);
      clearLoadingTimer();
      loadingTimerRef.current = setTimeout(() => {
        setMediaLoading(false);
        setMediaError(true);
      }, 15000);
    } else {
      setMediaLoading(false);
      setMediaError(false);
      clearLoadingTimer();
    }
    return clearLoadingTimer;
  }, [isVideoPost, post?.media]);

  // Bus subscription
  const myIdRef = useRef(`pcstable_${post?.id ?? Math.random().toString(36).slice(2)}`);
  useEffect(() => {
    const cb = async (evt) => {
      if (!videoRef.current) return;
      if (evt.type === 'SCROLLING') {
        if (evt.isScrolling && isVideoPlaying) await pauseVideo(true);
        return;
      }
      if (evt.type === 'PLAY_REQUESTED') {
        if (evt.id !== myIdRef.current && isVideoPlaying) await pauseVideo(true);
      }
      if (evt.type === 'PAUSE_REQUESTED') {
        if (evt.id === myIdRef.current && isVideoPlaying) await pauseVideo(false);
      }
    };
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  }, [isVideoPlaying]);

  // Safe play/pause
  const playVideo = async () => {
    if (!videoRef.current || opInFlightRef.current) return;
    opInFlightRef.current = true;
    try {
      await videoRef.current.playAsync();
      setIsVideoPlaying(true);
      manualPauseRef.current = false;
      PostCardStableBus.playRequested(myIdRef.current);
    } finally { opInFlightRef.current = false; }
  };
  const pauseVideo = async (silentManualFlag = false) => {
    if (!videoRef.current || opInFlightRef.current) return;
    opInFlightRef.current = true;
    try {
      await videoRef.current.pauseAsync();
      setIsVideoPlaying(false);
      if (!silentManualFlag) manualPauseRef.current = true;
      PostCardStableBus.pauseRequested(myIdRef.current);
    } finally { opInFlightRef.current = false; }
  };

  // Lifecycle
  useEffect(() => {
    let canceled = false;
    const manage = async () => {
      if (!isVideoPost || !videoRef.current) return;
      const shouldPlay =
        isActive && isFocused && !mediaLoading && !mediaError && !manualPauseRef.current;
      try {
        if (shouldPlay) {
          await playVideo();
        } else {
          await pauseVideo(true);
          if (!isActive && !isSeekingRef.current) {
            if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
            seekTimeoutRef.current = setTimeout(async () => {
              if (canceled || !videoRef.current) return;
              try {
                isSeekingRef.current = true;
                await videoRef.current.setPositionAsync(0);
              } catch { /* ignore */ }
              finally { isSeekingRef.current = false; }
            }, 120);
          }
        }
      } catch { /* ignore */ }
    };
    manage();
    return () => { if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current); };
  }, [isActive, isFocused, mediaLoading, mediaError, isVideoPost]);

  useEffect(() => { if (isActive) manualPauseRef.current = false; }, [isActive]);

  // Double-tap handling
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);
  const DOUBLE_TAP_DELAY = 300;

  const animateHeart = () => {
    if (heartAnimatingRef.current) return;       // guard repeated animations
    heartAnimatingRef.current = true;
    setShowHeart(true);
    heartScale.setValue(0.5);
    heartOpacity.setValue(1);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.5, useNativeDriver: true }),
      Animated.timing(heartOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setShowHeart(false);
      heartAnimatingRef.current = false;
    });
  };

  const onMediaTap = async () => {
    const now = Date.now();

    // Double-tap
    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // throttle like to avoid state storm while parent prop catches up
      if (!isLikeCoolingRef.current && !isLiked) {
        isLikeCoolingRef.current = true;
        onLikeToggle?.();
        setTimeout(() => { isLikeCoolingRef.current = false; }, 400);
      }
      animateHeart();
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
    } else {
      // Single-tap: play/pause (videos only)
      singleTapTimerRef.current = setTimeout(async () => {
        const since = Date.now() - lastToggleAtRef.current;
        if (since < TOGGLE_DEBOUNCE || mediaLoading || mediaError) return;
        lastToggleAtRef.current = Date.now();
        if (isVideoPost) {
          if (isVideoPlaying) await pauseVideo(false);
          else await playVideo();
        }
      }, DOUBLE_TAP_DELAY);
    }

    lastTapRef.current = now;
  };

  const onRetry = async () => {
    setMediaError(false);
    setMediaLoading(true);
    try {
      if (videoRef.current && post?.media?.[0]?.url) {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync(
          typeof post.media[0].url === 'string' ? { uri: post.media[0].url } : post.media[0].url,
          {},
          false
        );
      }
    } catch {
      setMediaError(true);
      setMediaLoading(false);
    }
  };

  const handleFullscreen = () => {
    const videoUrl = post?.media?.[0]?.url;
    const aspectRatio = getVideoAspect(videoUrl);
    setIsVideoPlaying(false);
    navigation.navigate('ReelScreen', {
      videoSource: videoUrl,
      caption: post.caption,
      timestamp: post.timestamp,
      user: post.user,
      isLiked,
      likesCount,
      isFollowed: localIsFollowed,
      isMuted,
      aspectRatio,
    });
  };

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: theme.background, marginBottom: 8 },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 12,
        },
        userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
        profileImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
        userName: { fontWeight: '600', fontSize: 14, color: theme.textPrimary },
        headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
        followButton: {
          backgroundColor: theme.social,
          paddingVertical: 6,
          paddingHorizontal: 16,
          borderRadius: 8,
          marginRight: 10,
        },
        followButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },

        moreButtonContainer: { position: 'relative' },
        moreButton: { padding: 4 },
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
        },
        igHandleBar: {
          width: 40,
          height: 5,
          borderRadius: 3,
          backgroundColor: theme.textDisabled,
          alignSelf: 'center',
          marginBottom: 16,
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
        separator: { height: 0.5, backgroundColor: theme.border },

        mediaWrapper: { position: 'relative' },
        mediaContainer: { height: width, position: 'relative', backgroundColor: '#000' },
        mediaImage: { width, height: width },

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
          paddingHorizontal: 12,
        },

        playButton: { position: 'absolute', top: '45%', left: '45%', zIndex: 10 },
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
        },
        duration: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          minWidth: 44,
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.3)',
        },
        durationText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },

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

        actions: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 0,
          paddingVertical: 6,
          marginLeft: 12,
        },
        actionButton: { padding: 4 },
        likesCount: { fontWeight: '600', fontSize: 14, color: theme.textPrimary },

        captionContainer: { paddingHorizontal: 0, paddingBottom: 4, marginLeft: 12, marginRight: 12 },
        caption: { fontSize: 14, color: theme.textPrimary, lineHeight: 18 },
        tagsContainer: { paddingHorizontal: 0, paddingBottom: 4, marginLeft: 12, marginRight: 12 },
        tagsText: { fontSize: 14, color: '#007AFF', lineHeight: 18 },

        timestamp: {
          fontSize: 12,
          color: theme.textSecondary,
          marginTop: 4,
          marginLeft: 12,
          marginBottom: 12,
          textAlign: 'left',
        },
      }),
    [theme]
  );

  return (
    <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: post.user.profileImage }}
              style={[
                styles.profileImage,
                { borderColor: post.user.userType === 'provider' ? theme.success : theme.primary, borderWidth: 2 },
              ]}
            />
            <Text style={styles.userName}>{post.user.firstName} {post.user.lastName}</Text>
          </View>
          <View style={styles.headerActions}>
            {!localIsFollowed && (
              <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
                <Text style={styles.followButtonText}>{tPosts('follow')}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.moreButtonContainer}>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => { setModalUser(`${post.user.firstName} ${post.user.lastName}`); setShowOptions(true); }}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Media */}
        {isVideoPost ? (
          <View style={styles.mediaWrapper}>
            <TouchableWithoutFeedback onPress={onMediaTap}>
              <View style={styles.mediaContainer}>
                {mediaLoading && !mediaError && (
                  <View style={styles.spinnerOverlay}><ActivityIndicator size="large" color="#fff" /></View>
                )}
                {mediaError && (
                  <View style={styles.errorOverlay}>
                    <Ionicons name="videocam-off" size={48} color="#fff" />
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={onRetry}>
                      <Ionicons name="refresh" size={28} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
                <Video
                  ref={videoRef}
                  source={post.media[0].url}
                  style={styles.mediaImage}
                  resizeMode="contain"
                  shouldPlay={isVideoPlaying}
                  isLooping
                  isMuted={isMuted}
                  useNativeControls={false}
                  onReadyForDisplay={() => { clearLoadingTimer(); setMediaLoading(false); setMediaError(false); }}
                  onPlaybackStatusUpdate={(status) => {
                    setVideoStatus(status);
                    if (status.isPlaying) { clearLoadingTimer(); setMediaLoading(false); setMediaError(false); }
                    if (status.isBuffering === false) setMediaLoading(false);
                    if (status.didJustFinish) setIsVideoPlaying(false);
                  }}
                  onError={() => { clearLoadingTimer(); setMediaError(true); setMediaLoading(false); }}
                />

                {/* Heart overlay */}
                {showHeart && (
                  <Animated.View
                    pointerEvents="none"
                    style={[styles.heartOverlay, { opacity: heartOpacity, transform: [{ scale: heartScale }] }]}
                  >
                    <Ionicons name="heart" size={64} color="#ff3040" />
                  </Animated.View>
                )}

                {/* Play icon */}
                {!isVideoPlaying && !mediaLoading && !mediaError && (
                  <View style={styles.playButton} pointerEvents="none">
                    <Ionicons name="play" size={48} color="#fff" />
                  </View>
                )}

                {/* Fullscreen & mute */}
                <TouchableOpacity style={styles.fullscreenIcon} onPress={handleFullscreen}>
                  <Ionicons name="expand" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.muteIcon} onPress={() => setIsMuted((p) => !p)}>
                  <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={24} color="#fff" />
                </TouchableOpacity>

                {/* Remaining time */}
                <View style={styles.duration}>
                  <Text style={styles.durationText}>
                    {formatTime((videoStatus.durationMillis || 0) - (videoStatus.positionMillis || 0))}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          // Images (NOW TAPPABLE FOR DOUBLE-LIKE)
          post?.media?.length > 0 && (
            <View style={styles.mediaWrapper}>
              <FlatList
                data={post.media}
                keyExtractor={(_, i) => String(i)}
                horizontal={post.media.length > 1}
                pagingEnabled={post.media.length > 1}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={onMediaTap}>
                    <View style={styles.mediaContainer}>
                      <Image source={item.url} style={styles.mediaImage} resizeMode="cover" />
                      {/* Heart overlay for image posts too */}
                      {showHeart && (
                        <Animated.View
                          pointerEvents="none"
                          style={[styles.heartOverlay, { opacity: heartOpacity, transform: [{ scale: heartScale }] }]}
                        >
                          <Ionicons name="heart" size={64} color="#ff3040" />
                        </Animated.View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
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
          transparent
          animationType="slide"
          onRequestClose={() => setShowOptions(false)}
        >
          <TouchableOpacity style={styles.igModalOverlay} activeOpacity={1} onPress={() => setShowOptions(false)}>
            <View style={styles.igOptionsContainer}>
              <View style={styles.igHandleBar} />
              {localIsFollowed && (
                <>
                  <TouchableOpacity style={styles.optionButton} onPress={() => { setShowOptions(false); onFollowToggle?.(); }}>
                    <Ionicons name="person-remove-outline" size={20} color={theme.textPrimary} style={styles.optionIcon} />
                    <Text style={styles.optionText}>{tPosts('unfollow')} {modalUser}</Text>
                  </TouchableOpacity>
                  <View className="separator" style={styles.separator} />
                </>
              )}
              <TouchableOpacity style={styles.optionButton} onPress={() => { setShowOptions(false); /* report */ }}>
                <Ionicons name="flag-outline" size={20} color={theme.error} style={styles.optionIcon} />
                <Text style={[styles.optionText, styles.reportText]}>{tPosts('report')} {modalUser}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PostCardStable;
