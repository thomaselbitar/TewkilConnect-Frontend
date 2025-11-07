import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const Location = ({
  // Context props
  contextState,
  contextDispatch,
  // Navigation props
  onBack,
  onNext,
  onCancel,
  // UI props
  headerTitle,
  // Validation props
  validateForm = true,
  // Image props
  maxImages = 5,
  imageDescription,
  // Group request props
  groupId = null,
}) => {
  const { theme } = useTheme();
  const { tLocation } = useTranslation();

  const [city, setCity] = useState(contextState?.location?.city || '');
  const [street, setStreet] = useState(contextState?.location?.street || '');
  const [building, setBuilding] = useState(contextState?.location?.building || '');
  const [selectedImages, setSelectedImages] = useState(contextState?.location?.images || []);

  // Save data to context immediately when user types
  useEffect(() => {
    if (contextDispatch) {
      contextDispatch({
        type: 'SET_LOCATION',
        payload: {
          city: city.trim(),
          street: street.trim(),
          building: building.trim(),
          images: selectedImages,
        },
      });
    }
  }, [city, street, building, selectedImages, contextDispatch]);

  const handlePickImage = async () => {
    if (selectedImages.length >= maxImages) {
      Alert.alert('Limit Reached', `${tLocation('errors.limitReached')} ${maxImages} images.`);
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', tLocation('errors.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', tLocation('errors.failedToPickImage'));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleNext = () => {
    if (validateForm) {
      if (!city.trim()) {
        Alert.alert('Error', tLocation('errors.enterCity'));
        return;
      }

      if (!street.trim()) {
        Alert.alert('Error', tLocation('errors.enterStreet'));
        return;
      }

      if (!building.trim()) {
        Alert.alert('Error', tLocation('errors.enterBuilding'));
        return;
      }
    }

    // Data is already saved by useEffect, just proceed to next screen
    if (onNext) {
      onNext({
        city: city.trim(),
        street: street.trim(),
        building: building.trim(),
        images: selectedImages,
      });
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const isNextDisabled = !city.trim() || !street.trim() || !building.trim();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingTop: 60,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        leftGroup: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        rightActions: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        backButton: {
          paddingHorizontal: 5,
          paddingVertical: 5,
          width: 34,
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 8,
          color: theme.textPrimary,
        },
        headerButton: {
          paddingHorizontal: 6,
          paddingVertical: 8,
          minWidth: 45,
        },
        textCancel: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textSecondary,
          marginRight: 8,
        },
        textNext: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.primary,
        },
        content: {
          flex: 1,
          padding: 20,
        },
        infoContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surfaceDark,
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        },
        infoText: {
          marginHorizontal: 8,
          fontSize: 13,
          color: theme.textSecondary,
        },
        inputContainer: {
          marginBottom: 25,
        },
        label: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textSecondary,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        textInput: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          backgroundColor: theme.surfaceLight,
          color: theme.textPrimary,
        },
        imageSection: {
          marginBottom: 30,
        },
        imageDescription: {
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 15,
        },
        imageGallery: {
          flexDirection: 'column',
          alignItems: 'stretch',
        },
        imageContainer: {
          position: 'relative',
          marginBottom: 10,
          width: '100%',
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 10,
          backgroundColor: theme.cardBackground,
          // iOS shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          // Android shadow
          elevation: 3,
        },
        selectedImage: {
          width: '100%',
          aspectRatio: 1,
          borderRadius: 8,
        },
        removeImageButton: {
          position: 'absolute',
          top: -10,
          right: -10,
          backgroundColor: theme.cardBackground,
          borderRadius: 12,
        },
        addImageButton: {
          borderWidth: 2,
          borderColor: theme.primary,
          borderStyle: 'dashed',
          borderRadius: 8,
          padding: 30,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.surfaceLight,
        },
        addImageText: {
          marginTop: 8,
          fontSize: 16,
          color: theme.primary,
          fontWeight: '500',
        },
        nextButton: {
          backgroundColor: theme.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          marginBottom: 40,
        },
        nextButtonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 'bold',
          marginRight: 8,
        },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Left section: Back arrow + title */}
        <View style={styles.leftGroup}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle || tLocation('title')}</Text>
        </View>

        {/* Right section: Cancel + Next */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={styles.textCancel}>{tLocation('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={isNextDisabled}
            style={[styles.headerButton, { opacity: isNextDisabled ? 0.5 : 1 }]}
          >
            <Text style={[styles.textNext, { color: isNextDisabled ? theme.textDisabled : theme.primary }]}>
              {tLocation('next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Message */}
        {groupId && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>{tLocation('groupWorkMessage')} {groupId}</Text>
          </View>
        )}

        {/* City Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{tLocation('city')} *</Text>
          <TextInput
            style={styles.textInput}
            value={city}
            onChangeText={setCity}
            placeholder={tLocation('placeholders.city')}
            placeholderTextColor={theme.textDisabled}
          />
        </View>

        {/* Street Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{tLocation('street')} *</Text>
          <TextInput
            style={styles.textInput}
            value={street}
            onChangeText={setStreet}
            placeholder={tLocation('placeholders.street')}
            placeholderTextColor={theme.textDisabled}
          />
        </View>

        {/* Building Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{tLocation('building')} *</Text>
          <TextInput
            style={styles.textInput}
            value={building}
            onChangeText={setBuilding}
            placeholder={tLocation('placeholders.building')}
            placeholderTextColor={theme.textDisabled}
          />
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>{tLocation('addImage')}</Text>
          <Text style={styles.imageDescription}>{imageDescription || tLocation('imageDescription')}</Text>

          <View style={styles.imageGallery}>
            {selectedImages.map((imageUri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                  <Ionicons name="close-circle" size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>
            ))}
            {selectedImages.length < maxImages && (
              <TouchableOpacity style={styles.addImageButton} onPress={handlePickImage}>
                <Ionicons name="camera-outline" size={32} color={theme.primary} />
                <Text style={styles.addImageText}>{tLocation('addPhoto')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{tLocation('next')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Location;
