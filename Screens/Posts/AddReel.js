import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import TagSelectionModal from '../../components/Modal/TagSelectionModal';

const { width: screenWidth } = Dimensions.get('window');

const AddReel = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tAddReel } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: tAddReel('title'),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: theme.textPrimary,
      },
      headerStyle: {
        backgroundColor: theme.background,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          onPress={handlePublish}
          disabled={!selectedVideo || isPublishing}
          style={[
            styles.headerButton,
            { opacity: !selectedVideo || isPublishing ? 0.5 : 1 },
          ]}
        >
          <Text style={[styles.publishButton, { color: !selectedVideo ? theme.textDisabled : theme.primary }]}>
            {isPublishing ? tAddReel('publishing') : tAddReel('publish')}
          </Text>
        </TouchableOpacity>
      ),
      // Disable swipe back gesture when there's content
      gestureEnabled: !(selectedVideo || caption.trim()),
    });
  }, [navigation, selectedVideo, isPublishing, caption, theme, tAddReel]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectedVideo || caption.trim()) {
          Alert.alert(
            tAddReel('alerts.discardReel'),
            tAddReel('alerts.discardConfirm'),
            [
              { text: tAddReel('alerts.keepEditing'), style: 'cancel' },
              {
                text: tAddReel('alerts.discard'),
                style: 'destructive',
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: true }
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [selectedVideo, caption, tAddReel])
  );

  // Keyboard listeners for Android
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleBackPress = () => {
    if (selectedVideo || caption.trim()) {
      Alert.alert(
        tAddReel('alerts.discardReel'),
        tAddReel('alerts.discardConfirm'),
        [
          { text: tAddReel('alerts.keepEditing'), style: 'cancel' },
          {
            text: tAddReel('alerts.discard'),
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: true }
      );
    } else {
      navigation.goBack();
    }
  };

  const pickVideo = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(tAddReel('alerts.permissionNeeded'), tAddReel('alerts.grantCameraRollPermissions'));
        return;
      }



      // Pick video with editing only on iOS, but 1-minute limit on both
      const pickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: Platform.OS === 'ios',
        aspect: Platform.OS === 'ios' ? [9, 16] : undefined,
        quality: 0.8,
        videoMaxDuration: 60,
        allowsMultipleSelection: false,
      };

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets && result.assets[0]) {
        const video = result.assets[0];
        
        console.log('Selected video:', video);
        console.log('Platform:', Platform.OS);
        console.log('Video editing result:', result);
        
        // Check video duration as a safety fallback for both platforms
        if (video.duration) {
          // video.duration might be in milliseconds, convert to seconds
          const durationInSeconds = video.duration > 1000 ? video.duration / 1000 : video.duration;
          
          console.log('Duration check:', { original: video.duration, inSeconds: durationInSeconds, platform: Platform.OS });
          
          if (durationInSeconds > 60) {
            console.log('Video too long, showing alert and returning');
            const platformMessage = Platform.OS === 'ios' 
              ? tAddReel('alerts.trimVideoIOS')
              : tAddReel('alerts.selectVideo1Minute');
              
            Alert.alert(
              tAddReel('alerts.videoTooLong'),
              platformMessage,
              [{ text: tAddReel('alerts.ok') }]
            );
            return;
          }
        }
        
        console.log('Setting selected video - duration check passed');
        setSelectedVideo({
          id: Date.now().toString(),
          uri: video.uri,
          duration: video.duration || 0,
          width: video.width,
          height: video.height,
        });
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert(tAddReel('alerts.error'), tAddReel('alerts.failedToSelectVideo'));
    }
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
    }
  };

  const seekTo = async (time) => {
    if (videoRef.current && duration > 0) {
      const clampedTime = Math.max(0, Math.min(duration, time));
      await videoRef.current.setPositionAsync(clampedTime * 1000);
    }
  };



  const seekForward = async () => {
    const newTime = Math.min(currentTime + 5, duration);
    await seekTo(newTime);
  };

  const seekBackward = async () => {
    const newTime = Math.max(currentTime - 5, 0);
    await seekTo(newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  const handleCaptionChange = (text) => {
    // Simple: just limit to 200 characters
    if (text.length <= 200) {
      setCaption(text);
    }
  };

  const handlePublish = async () => {
    if (!selectedVideo) {
      Alert.alert(tAddReel('alerts.noVideo'), tAddReel('alerts.selectVideoToPublish'));
      return;
    }

    // Dismiss keyboard when publishing
    Keyboard.dismiss();

    setIsPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Publishing reel with:', { video: selectedVideo, caption, tags: selectedTags });

      Alert.alert(tAddReel('alerts.success'), tAddReel('alerts.reelPublishedSuccessfully'), [
        { text: tAddReel('alerts.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(tAddReel('alerts.error'), tAddReel('alerts.failedToPublishReel'));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTagsSelected = (tags) => {
    setSelectedTags(tags);
  };



  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS === 'android' && isKeyboardVisible && { paddingBottom: 350 }
        ]}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
      >
        {/* Video Selection Section */}
        <View style={styles.videoSection}>
          {!selectedVideo ? (
            <TouchableOpacity style={[styles.addVideoButton, { borderColor: theme.primary, backgroundColor: theme.surfaceLight }]} onPress={pickVideo}>
              <Ionicons name="videocam" size={40} color={theme.primary} />
              <Text style={[styles.addVideoText, { color: theme.primary }]}>{tAddReel('addVideo')}</Text>
              <Text style={[styles.addVideoSubtext, { color: theme.textSecondary }]}>{tAddReel('selectVideo1Minute')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={[
              styles.videoContainer,
              (selectedVideo.width === selectedVideo.height || selectedVideo.width > selectedVideo.height) && styles.compactVideoContainer
            ]}>
              {/* Background for non-portrait videos */}
              {(selectedVideo.width === selectedVideo.height || selectedVideo.width > selectedVideo.height) && (
                <View style={styles.videoBackground} />
              )}
              <Video
                ref={videoRef}
                source={{ uri: selectedVideo.uri }}
                style={[
                  styles.video,
                  (selectedVideo.width === selectedVideo.height || selectedVideo.width > selectedVideo.height) && styles.centeredVideo
                ]}
                useNativeControls={false}
                resizeMode={(selectedVideo.width === selectedVideo.height || selectedVideo.width > selectedVideo.height) ? "contain" : "cover"}
                isLooping={true}
                shouldPlay={Platform.OS === 'android'}
                shouldCorrectPitch={true}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />
              
              {/* Custom Controls Overlay */}
              <View style={styles.controlsOverlay}>
                {/* Top Controls */}
                <View style={styles.topControls}>
                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeVideoButton}
                    onPress={removeVideo}
                  >
                    <Ionicons name="close-circle" size={28} color={theme.primary} />
                  </TouchableOpacity>
                  
                  {/* Time Display */}
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {formatTime(duration - currentTime)}
                    </Text>
                  </View>
                </View>

                {/* Center Controls */}
                <View style={styles.centerControlsContainer}>
                  {/* Seek Backward */}
                  <TouchableOpacity
                    style={styles.seekButton}
                    onPress={seekBackward}
                  >
                    <Text style={styles.seekText}>{tAddReel('seekBackward')}</Text>
                  </TouchableOpacity>

                  {/* Play/Pause Button */}
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={togglePlayPause}
                  >
                    <Ionicons 
                      name={isPlaying ? "pause" : "play"} 
                      size={32} 
                      color="white" 
                    />
                  </TouchableOpacity>

                  {/* Seek Forward */}
                  <TouchableOpacity
                    style={styles.seekButton}
                    onPress={seekForward}
                  >
                    <Text style={styles.seekText}>{tAddReel('seekForward')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${(currentTime / duration) * 100}%`, backgroundColor: theme.primary }
                        ]} 
                      />

                    </View>
                    <TouchableOpacity 
                      style={styles.progressBarTouchable}
                      activeOpacity={1}
                      onPress={(event) => {
                        const { locationX } = event.nativeEvent;
                        const progressBarWidth = screenWidth - 80 - 24; // Account for margins and padding
                        const percentage = Math.max(0, Math.min(1, locationX / progressBarWidth));
                        const newTime = percentage * duration;
                        seekTo(newTime);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
        {/* Caption Section */}
        <View style={styles.captionSection}>
          <Text style={[styles.captionLabel, { color: theme.primary }]}>{tAddReel('captionLabel')}</Text>
          <TextInput
            style={[styles.captionInput, { 
              borderColor: theme.border, 
              backgroundColor: theme.cardBackground,
              color: theme.textPrimary,
            }]}
            placeholder={tAddReel('captionPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            value={caption}
            onChangeText={handleCaptionChange}
            multiline
            maxLength={200}
            textAlignVertical="top"
            blurOnSubmit={true}
            returnKeyType="done"
          />
          <Text style={[styles.characterCount, { color: theme.textSecondary }]}>{caption.length}/200</Text>
        </View>

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <View style={styles.tagsHeader}>
            <Text style={[styles.tagsLabel, { color: theme.primary }]}>{tAddReel('tags')}</Text>
            <TouchableOpacity 
              style={[styles.addTagsButton, { borderColor: theme.primary }]}
              onPress={() => setIsTagModalVisible(true)}
            >
              <Ionicons name="add" size={16} color={theme.primary} />
              <Text style={[styles.addTagsText, { color: theme.primary }]}>
                {selectedTags.length > 0 ? tAddReel('editTags') : tAddReel('addTags')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {selectedTags.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedTags.map((tag, index) => (
                <View key={index} style={[styles.selectedTag, { backgroundColor: theme.primary }]}>
                  <Text style={styles.selectedTagText}>#{tag.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Tag Selection Modal */}
      <TagSelectionModal
        visible={isTagModalVisible}
        onClose={() => setIsTagModalVisible(false)}
        onTagsSelected={handleTagsSelected}
        selectedTags={selectedTags}
        maxTags={5}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  publishButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  videoSection: {
    padding: 20,
  },
  addVideoButton: {
    height: screenWidth - 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addVideoText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  addVideoSubtext: {
    fontSize: 14,
    marginTop: 5,
  },
  videoContainer: {
    height: (screenWidth - 40) * 2,
    width: screenWidth - 40,
    alignSelf: 'center',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactVideoContainer: {
    height: screenWidth - 40,
    width: screenWidth - 40,
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  centeredVideo: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },

  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  removeVideoButton: {
    backgroundColor: 'white',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  centerControlsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  seekButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 10,
  },
  progressBarTouchable: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  captionSection: {
    padding: 20,
  },
  captionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  tagsSection: {
    padding: 20,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  addTagsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 16,
  },
  addTagsText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedTagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AddReel; 