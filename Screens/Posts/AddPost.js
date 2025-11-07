import React, { useState, useLayoutEffect, useEffect } from 'react';
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
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import TagSelectionModal from '../../components/Modal/TagSelectionModal';

const { width: screenWidth } = Dimensions.get('window');

const AddPost = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tAddPost } = useTranslation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);

    useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: tAddPost('title'),
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
          disabled={selectedImages.length === 0 || isPublishing}
          style={[
            styles.headerButton,
            { opacity: selectedImages.length === 0 || isPublishing ? 0.5 : 1 },
          ]}
        >
          <Text style={[styles.publishButton, { color: selectedImages.length === 0 ? theme.textDisabled : theme.primary }]}>
            {isPublishing ? tAddPost('publishing') : tAddPost('publish')}
          </Text>
        </TouchableOpacity>
      ),
      // Disable swipe back gesture when there's content
      gestureEnabled: !(selectedImages.length > 0 || caption.trim()),
    });
  }, [navigation, selectedImages.length, isPublishing, caption, theme, tAddPost]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectedImages.length > 0 || caption.trim()) {
          Alert.alert(
            tAddPost('alerts.discardPost'),
            tAddPost('alerts.discardConfirm'),
            [
              { text: tAddPost('alerts.keepEditing'), style: 'cancel' },
              {
                text: tAddPost('alerts.discard'),
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
    }, [selectedImages.length, caption, tAddPost])
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
    if (selectedImages.length > 0 || caption.trim()) {
      Alert.alert(
        tAddPost('alerts.discardPost'),
        tAddPost('alerts.discardConfirm'),
        [
          { text: tAddPost('alerts.keepEditing'), style: 'cancel' },
          {
            text: tAddPost('alerts.discard'),
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

  const pickImage = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert(tAddPost('alerts.limitReached'), tAddPost('alerts.onlySelectUpTo3Images'));
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(tAddPost('alerts.permissionDenied'), tAddPost('alerts.mediaLibraryRequired'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newImage = {
          uri: result.assets[0].uri,
          id: Date.now().toString(),
        };
        setSelectedImages((prev) => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(tAddPost('alerts.error'), tAddPost('alerts.failedToPickImage'));
    }
  };

  const removeImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
    setCurrentPhotoIndex(0);
  };

  const handleCaptionChange = (text) => {
    // Simple: just limit to 200 characters
    if (text.length <= 200) {
      setCaption(text);
    }
  };

  const handlePublish = async () => {
    if (selectedImages.length === 0) {
      Alert.alert(tAddPost('alerts.noImages'), tAddPost('alerts.selectAtLeastOneImage'));
      return;
    }

    // Dismiss keyboard when publishing
    Keyboard.dismiss();

    setIsPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Publishing post with:', { images: selectedImages, caption, tags: selectedTags });

      Alert.alert(tAddPost('alerts.success'), tAddPost('alerts.postPublishedSuccess'), [
        { text: tAddPost('alerts.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(tAddPost('alerts.error'), tAddPost('alerts.failedToPublishPost'));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTagsSelected = (tags) => {
    setSelectedTags(tags);
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.cardImageItem}>
      <Image source={{ uri: item.uri }} style={styles.cardImage} />
    </View>
  );

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
        {/* Image Selection Section */}
        <View style={styles.imageSection}>
          {selectedImages.length === 0 ? (
            <TouchableOpacity style={[styles.addImageButton, { borderColor: theme.primary, backgroundColor: theme.surfaceLight }]} onPress={pickImage}>
              <Ionicons name="add" size={40} color={theme.primary} />
              <Text style={[styles.addImageText, { color: theme.primary }]}>{tAddPost('addImages')}</Text>
              <Text style={[styles.addImageSubtext, { color: theme.textSecondary }]}>{tAddPost('selectUpTo3Images')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.cardImageContainer, { borderColor: theme.primary }]}>
              <FlatList
                data={selectedImages}
                renderItem={renderImageItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                style={styles.cardImageList}
                onMomentumScrollEnd={(event) => {
                  const itemWidth = screenWidth - 40 - 2; // Account for border width (1px on each side)
                  const index = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
                  setCurrentPhotoIndex(index);
                }}
              />
              {/* Image Count Indicator */}
              {selectedImages.length > 1 && (
                <View style={styles.imageCountContainer}>
                  <Text style={styles.imageCountText}>
                    {currentPhotoIndex + 1}/{selectedImages.length}
                  </Text>
                </View>
              )}
              {/* Remove Button */}
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(selectedImages[currentPhotoIndex].id)}
              >
                <Ionicons name="close-circle" size={28} color="white" />
              </TouchableOpacity>
              {/* Add More Button */}
              {selectedImages.length < 3 && (
                <TouchableOpacity style={styles.addMoreButton} onPress={pickImage}>
                  <Ionicons name="add-circle" size={32} color={theme.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        {/* Caption Section */}
        <View style={styles.captionSection}>
          <Text style={[styles.captionLabel, { color: theme.primary }]}>{tAddPost('caption')}</Text>
          <TextInput
            style={[styles.captionInput, { 
              borderColor: theme.border, 
              backgroundColor: theme.cardBackground,
              color: theme.textPrimary,
            }]}
            placeholder={tAddPost('writeCaption')}
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
            <Text style={[styles.tagsLabel, { color: theme.primary }]}>{tAddPost('tags')}</Text>
            <TouchableOpacity 
              style={[styles.addTagsButton, { borderColor: theme.primary }]}
              onPress={() => setIsTagModalVisible(true)}
            >
              <Ionicons name="add" size={16} color={theme.primary} />
              <Text style={[styles.addTagsText, { color: theme.primary }]}>
                {selectedTags.length > 0 ? tAddPost('editTags') : tAddPost('addTags')}
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
  imageSection: {
    padding: 20,
  },
  addImageButton: {
    height: screenWidth - 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  addImageSubtext: {
    fontSize: 14,
    marginTop: 5,
  },
  cardImageContainer: {
    height: screenWidth - 40,
    width: screenWidth - 40,
    alignSelf: 'center',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImageList: {
    flexGrow: 0,
  },
  cardImageItem: {
    width: screenWidth - 40 - 2, // Account for border width (1px on each side)
    height: screenWidth - 40 - 2, // Account for border width (1px on each side)
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCountContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 14,
  },
  addMoreButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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

export default AddPost;
