import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { wp, hp } from '../../utils/helpers';
import ProviderCard from '../../components/Card/ProviderCards/ProviderCard';
import { providers } from '../../Data/Data';
import { categories, getCategoryTranslation } from '../../Data/CategoryandTag';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const EditUserRequest = ({ route, navigation }) => {
  const { initialData = {}, requestId, originalStatus } = route.params;
  const { theme } = useTheme();
  const { tEditRequest, tCategories } = useTranslation();

  // Helper function to check if category is custom
  const isCustomCategory = (category) => {
    return Boolean(category && !categories.some((cat) => cat.title === category));
  };

  // Helper function to get translated category name
  const getCategoryText = (categoryTitle) => {
    return getCategoryTranslation(categoryTitle, tCategories);
  };

  // Default props
  const headerTitle = originalStatus === 'Declined' ? tEditRequest('resend') : tEditRequest('title');
  const validateForm = true;
  const maxImages = 5;
  const groupId = initialData.groupId || null;

  // Category Selection State
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialData.category || '');

  // Location State
  const [city, setCity] = useState(initialData.location?.city || '');
  const [street, setStreet] = useState(initialData.location?.street || '');
  const [building, setBuilding] = useState(initialData.location?.building || '');
  const [selectedImages, setSelectedImages] = useState(initialData.location?.images || []);

  // Provider Selection State
  const [selectionType, setSelectionType] = useState(initialData.providerSelection?.type || 'all');
  const [selectedProvider, setSelectedProvider] = useState(initialData.providerSelection?.selectedProvider);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef();

  // Request Details State
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [timingType, setTimingType] = useState(initialData.timing?.type || '');
  const [selectedDay, setSelectedDay] = useState(initialData.timing?.day || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialData.timing?.timeSlot || '');

  // Budget State
  const [hasBudget, setHasBudget] = useState(initialData.budget?.hasBudget || false);
  const [budgetType, setBudgetType] = useState(initialData.budget?.type || 'fixed');
  const [budgetAmount, setBudgetAmount] = useState(initialData.budget?.amount > 0 ? initialData.budget.amount.toString() : '');
  const [hourlyRate, setHourlyRate] = useState(initialData.budget?.hourlyRate > 0 ? initialData.budget.hourlyRate.toString() : '');

  // Section Collapse State
  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    location: false,
    providerSelection: false,
    budget: false,
    requestDetails: false,
  });

  // Toggle section collapse
  const toggleSection = (sectionName) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Initialize category from initial data
  useEffect(() => {
    const contextCategory = initialData.category || '';
    if (contextCategory) {
      const isDefaultCategory = defaultCategories.some(cat => cat.title === contextCategory);
      if (isDefaultCategory) {
        setSelectedCategory(contextCategory);
        setShowCustomInput(false);
        setCustomCategory('');
      } else {
        setSelectedCategory('Other');
        setShowCustomInput(true);
        setCustomCategory(contextCategory);
      }
    }
  }, [initialData.category]);

  // Auto-select 'all' providers for custom categories and reset invalid selections
  useEffect(() => {
    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;

    if (isCustomCategory(finalCategory)) {
      setSelectionType('all');
      setSelectedProvider(null);
    } else if (finalCategory && selectedProvider) {
      // Check if the currently selected provider is still valid for the new category
      const isProviderValid = selectedProvider.category === finalCategory;

      if (!isProviderValid) {
        // Reset to 'all' if the selected provider doesn't match the new category
        setSelectionType('all');
        setSelectedProvider(null);
      }
    }
  }, [selectedCategory, customCategory, selectedProvider]);

  // Use centralized categories and add "Other" option
  const defaultCategories = [
    ...categories,
    { id: 'other', title: 'Other', iconName: 'add-circle-outline' }
  ];

  const days = [
    { key: 'Monday', label: tEditRequest('requestDetails.monday') },
    { key: 'Tuesday', label: tEditRequest('requestDetails.tuesday') },
    { key: 'Wednesday', label: tEditRequest('requestDetails.wednesday') },
    { key: 'Thursday', label: tEditRequest('requestDetails.thursday') },
    { key: 'Friday', label: tEditRequest('requestDetails.friday') },
    { key: 'Saturday', label: tEditRequest('requestDetails.saturday') },
    { key: 'Sunday', label: tEditRequest('requestDetails.sunday') }
  ];
  const timeSlots = [
    { key: 'Morning', label: tEditRequest('requestDetails.morning') },
    { key: 'Midday', label: tEditRequest('requestDetails.midday') },
    { key: 'Afternoon', label: tEditRequest('requestDetails.afternoon') },
    { key: 'Evening', label: tEditRequest('requestDetails.evening') }
  ];

  const ratingOptions = [
    { value: 0, label: tEditRequest('ratingFilters.allRatings'), min: 0, max: 5 },
    { value: 1, label: tEditRequest('ratingFilters.oneTwoStars'), min: 1, max: 2 },
    { value: 2, label: tEditRequest('ratingFilters.twoThreeStars'), min: 2, max: 3 },
    { value: 3, label: tEditRequest('ratingFilters.threeFourStars'), min: 3, max: 4 },
    { value: 4, label: tEditRequest('ratingFilters.fourFiveStars'), min: 4, max: 5 },
    { value: 5, label: tEditRequest('ratingFilters.fiveStars'), min: 5, max: 5 },
  ];

  // Filter providers based on search query, rating, and category
  const filteredProviders = (() => {
    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
    
    // If no category is selected, return empty array (user can't proceed anyway)
    if (!finalCategory) {
      return [];
    }
    
    // If it's a custom category, return empty array (specific provider option is disabled)
    if (isCustomCategory(finalCategory)) {
      return [];
    }
    
    // Only filter providers for predefined categories
    return providers.filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchQuery.toLowerCase());

      const selectedOption = ratingOptions.find(option => option.value === ratingFilter);
      const matchesRating = ratingFilter === 0 ||
        (provider.rating >= selectedOption.min && provider.rating < selectedOption.max);

      // Filter by category - only show providers that match the selected category
      const matchesCategory = provider.category === finalCategory;

      return matchesSearch && matchesRating && matchesCategory;
    });
  })();

  // Search logic with spinner
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    // Show spinner when search query changes
    if (searchQuery.length > 0) {
      setIsSearching(true);
    }

    searchTimeout.current = setTimeout(() => {
      // Search completed
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  // Category Selection Handlers
  const handleCategorySelect = (category) => {
    if (category.title === 'Other') {
      setShowCustomInput(true);
      setSelectedCategory('Other');
    } else {
      setSelectedCategory(category.title);
      setShowCustomInput(false);
      setCustomCategory('');
    }
  };

  const handleCustomCategoryChange = (text) => {
    setCustomCategory(text);
  };

  // Location Handlers
  const handlePickImage = async () => {
    if (selectedImages.length >= maxImages) {
      Alert.alert(tEditRequest('alerts.limitReached'), tEditRequest('alerts.imageLimit').replace('{maxImages}', maxImages));
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(tEditRequest('alerts.permissionDenied'), tEditRequest('alerts.mediaAccessRequired'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.failedToPickImage'));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Provider Selection Handlers
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  // Loading state for save
  const [isSaving, setIsSaving] = useState(false);

  // Save Handler
  const handleSave = async () => {
    if (validateForm) {
      // Validate Category
      if (!selectedCategory) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.selectCategory'));
        return;
      }
      if (selectedCategory === 'Other' && !customCategory.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterCustomCategory'));
        return;
      }

      // Validate Location
      if (!city.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterCity'));
        return;
      }
      if (!street.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterStreet'));
        return;
      }
      if (!building.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterBuilding'));
        return;
      }

      // Validate Provider Selection
      if (selectionType === 'specific' && !selectedProvider) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.selectProvider'));
        return;
      }

      // Validate Request Details
      if (!title.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterTitle'));
        return;
      }
      if (!description.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterDescription'));
        return;
      }
      if (!timingType) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.selectTiming'));
        return;
      }
      if (timingType === 'flexible' && (!selectedDay || !selectedTimeSlot)) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.selectDayAndTime'));
        return;
      }

      // Validate Budget
      if (hasBudget && budgetType !== 'fixed' && budgetType !== 'hourly') {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.selectBudgetType'));
        return;
      }
      if (hasBudget && budgetType === 'fixed' && !budgetAmount.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterBudgetAmount'));
        return;
      }
      if (hasBudget && budgetType === 'hourly' && !hourlyRate.trim()) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterHourlyRate'));
        return;
      }
      if (hasBudget && budgetType === 'fixed' && parseFloat(budgetAmount) <= 0) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterValidBudgetAmount'));
        return;
      }
      if (hasBudget && budgetType === 'hourly' && parseFloat(hourlyRate) <= 0) {
        Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.enterValidHourlyRate'));
        return;
      }
    }

    // Set saving state
    setIsSaving(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Prepare data for saving
      const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;

      const requestData = {
        category: finalCategory,
        location: {
          city: city.trim(),
          street: street.trim(),
          building: building.trim(),
          images: selectedImages,
        },
        providerSelection: {
          type: selectionType,
          selectedProvider: selectionType === 'specific' ? selectedProvider : null,
        },
        title: title.trim(),
        description: description.trim(),
        timing: {
          type: timingType,
          day: selectedDay,
          timeSlot: selectedTimeSlot
        },
        budget: {
          hasBudget,
          type: hasBudget ? budgetType : 'none',
          amount: hasBudget && budgetType === 'fixed' ? parseFloat(budgetAmount) : 0,
          hourlyRate: hasBudget && budgetType === 'hourly' ? parseFloat(hourlyRate) : 0,
        }
      };

      // Show success alert before navigation
      Alert.alert(
        tEditRequest('alerts.success'),
        originalStatus === 'Declined' ? tEditRequest('alerts.requestResent') : tEditRequest('alerts.requestUpdated'),
        [
          {
            text: tEditRequest('alerts.ok'),
            onPress: () => {
              // Navigate back with the updated data after user acknowledges the alert
              navigation.replace('UserRequestDetails', {
                updatedRequest: {
                  ...requestData,
                  id: requestId,
                  status: 'Pending', // Reset status when edited
                  updatedAt: new Date().toISOString(),
                },
                isUpdated: true,
              });
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert(tEditRequest('alerts.error'), tEditRequest('alerts.failedToSave'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackOrCancel = () => {
    // Check if any changes were made
    const hasChanges =
      selectedCategory !== (initialData.category || '') ||
      city !== (initialData.location?.city || '') ||
      street !== (initialData.location?.street || '') ||
      building !== (initialData.location?.building || '') ||
      title !== (initialData.title || '') ||
      description !== (initialData.description || '') ||
      timingType !== (initialData.timing?.type || '') ||
      hasBudget !== (initialData.budget?.hasBudget || false) ||
      budgetType !== (initialData.budget?.type || 'fixed') ||
      budgetAmount !== (initialData.budget?.amount > 0 ? initialData.budget.amount.toString() : '') ||
      hourlyRate !== (initialData.budget?.hourlyRate > 0 ? initialData.budget.hourlyRate.toString() : '');

    if (hasChanges) {
      Alert.alert(
        tEditRequest('alerts.discardChanges'),
        tEditRequest('alerts.discardConfirm'),
        [
          {
            text: tEditRequest('alerts.keepEditing'),
            style: 'cancel',
          },
          {
            text: tEditRequest('alerts.discard'),
            style: 'destructive',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const isSaveDisabled =
    isSaving ||
    !selectedCategory ||
    (selectedCategory === 'Other' && !customCategory.trim()) ||
    !city.trim() ||
    !street.trim() ||
    !building.trim() ||
    (selectionType === 'specific' && !selectedProvider) ||
    !title.trim() ||
    !description.trim() ||
    !timingType ||
    (timingType === 'flexible' && (!selectedDay || !selectedTimeSlot)) ||
    (hasBudget && budgetType === 'fixed' && !budgetAmount.trim()) ||
    (hasBudget && budgetType === 'hourly' && !hourlyRate.trim());


  // configure header inside the screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={[styles.headerLeftGroup, { backgroundColor: theme.background }]}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBackOrCancel}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{headerTitle || ''}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={[styles.headerRightActions, { backgroundColor: theme.background }]}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBackOrCancel}>
            <Text style={[styles.textCancel, { color: theme.textSecondary }]}>{tEditRequest('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
            disabled={isSaveDisabled}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Text style={[styles.textSave, { color: theme.primary }, isSaveDisabled && styles.textSaveDisabled]}>
                {originalStatus === 'Declined' ? tEditRequest('resend') : tEditRequest('save')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ),
      headerStyle: [styles.headerStyle, { backgroundColor: theme.background, borderBottomColor: theme.border }],
    });
  }, [navigation, headerTitle, isSaving, isSaveDisabled, handleSave, handleBackOrCancel, theme, tEditRequest, originalStatus]);
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Message */}
        {groupId && (
          <View style={[styles.infoContainer, { backgroundColor: theme.surfaceDark }]}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>{tEditRequest('groupInfo').replace('{groupId}', groupId)}</Text>
          </View>
        )}

        {/* Category Selection Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('category')}
          >
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tEditRequest('sections.category')}</Text>
            <Ionicons
              name={collapsedSections.category ? "chevron-down" : "chevron-up"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>

          {!collapsedSections.category && (
            <>
              <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>{tEditRequest('category.description')}</Text>

              <View style={styles.categoriesGrid}>
                {defaultCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                      (selectedCategory === category.title || (category.title === 'Other' && selectedCategory === 'Other')) && { backgroundColor: theme.primary, borderColor: theme.primary }
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name={category.iconName}
                        size={24}
                        color={(selectedCategory === category.title || (category.title === 'Other' && selectedCategory === 'Other')) ? 'white' : theme.primary}
                      />
                    </View>
                    <Text style={[
                      styles.categoryText,
                      { color: theme.textPrimary },
                      (selectedCategory === category.title || (category.title === 'Other' && selectedCategory === 'Other')) && styles.selectedCategoryText
                    ]}>
                      {getCategoryText(category.title)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Category Input */}
              {showCustomInput && (
                <View style={[styles.customInputContainer, { backgroundColor: theme.surfaceLight }]}>
                  <Text style={[styles.customInputLabel, { color: theme.textSecondary }]}>{tEditRequest('category.customLabel')}</Text>
                  <TextInput
                    style={[styles.customInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
                    value={customCategory}
                    onChangeText={handleCustomCategoryChange}
                    placeholder={tEditRequest('category.customPlaceholder')}
                    placeholderTextColor={theme.textTertiary}
                  />
                </View>
              )}
            </>
          )}
        </View>

        {/* Request Details Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('requestDetails')}
          >
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tEditRequest('sections.requestDetails')}</Text>
            <Ionicons
              name={collapsedSections.requestDetails ? "chevron-down" : "chevron-up"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>

          {!collapsedSections.requestDetails && (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('requestDetails.titleLabel')}</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder={tEditRequest('requestDetails.titlePlaceholder')}
                  placeholderTextColor={theme.textTertiary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('requestDetails.descriptionLabel')}</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder={tEditRequest('requestDetails.descriptionPlaceholder')}
                  placeholderTextColor={theme.textTertiary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Timing Section */}
              <View style={styles.timingSection}>
                <Text style={[styles.subSectionTitle, { color: theme.primary }]}>{tEditRequest('requestDetails.timing')}</Text>

                {/* Timing Type Selection */}
                <View style={styles.timingTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.timingTypeButton,
                      { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                      timingType === 'flexible' && { backgroundColor: theme.primary, borderColor: theme.primary }
                    ]}
                    onPress={() => setTimingType('flexible')}
                  >
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={timingType === 'flexible' ? 'white' : theme.textSecondary}
                    />
                    <Text style={[
                      styles.timingTypeText,
                      { color: theme.textSecondary },
                      timingType === 'flexible' && styles.selectedTimingTypeText
                    ]}>
                      {tEditRequest('requestDetails.flexible')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.timingTypeButton,
                      { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                      timingType === 'urgent' && { backgroundColor: theme.primary, borderColor: theme.primary }
                    ]}
                    onPress={() => setTimingType('urgent')}
                  >
                    <Ionicons
                      name="flash"
                      size={20}
                      color={timingType === 'urgent' ? 'white' : theme.textSecondary}
                    />
                    <Text style={[
                      styles.timingTypeText,
                      { color: theme.textSecondary },
                      timingType === 'urgent' && styles.selectedTimingTypeText
                    ]}>
                      {tEditRequest('requestDetails.urgent')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Flexible Timing Options */}
                {timingType === 'flexible' && (
                  <View style={styles.flexibleOptions}>
                    {/* Day Selection */}
                    <Text style={[styles.subLabel, { color: theme.textSecondary }]}>{tEditRequest('requestDetails.selectDay')}</Text>
                    <View style={styles.optionsGrid}>
                      {days.map((day) => (
                        <TouchableOpacity
                          key={day.key}
                          style={[
                            styles.optionButton,
                            { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                            selectedDay === day.key && { backgroundColor: theme.primary, borderColor: theme.primary }
                          ]}
                          onPress={() => setSelectedDay(day.key)}
                        >
                          <Text style={[
                            styles.optionText,
                            { color: theme.textSecondary },
                            selectedDay === day.key && styles.selectedOptionText
                          ]}>
                            {day.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Time Slot Selection */}
                    <Text style={[styles.subLabel, { color: theme.textSecondary }]}>{tEditRequest('requestDetails.selectTime')}</Text>
                    <View style={styles.timeSlotsGrid}>
                      {timeSlots.map((slot) => (
                        <TouchableOpacity
                          key={slot.key}
                          style={[
                            styles.timeSlotCard,
                            { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                            selectedTimeSlot === slot.key && { borderColor: theme.primary, borderWidth: 2 }
                          ]}
                          onPress={() => setSelectedTimeSlot(slot.key)}
                        >
                          <View style={styles.timeSlotIcon}>
                            <Ionicons
                              name={
                                slot.key === 'Morning' ? 'sunny-outline' :
                                  slot.key === 'Midday' ? 'sunny' :
                                    slot.key === 'Afternoon' ? 'partly-sunny-outline' :
                                      'moon-outline'
                              }
                              size={28}
                              color={selectedTimeSlot === slot.key ? theme.primary : theme.textSecondary}
                            />
                          </View>
                          <Text style={[
                            styles.timeSlotTitle,
                            { color: theme.textSecondary },
                            selectedTimeSlot === slot.key && { color: theme.primary }
                          ]}>
                            {slot.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Informational Message */}
                    <View style={[styles.infoContainer, { backgroundColor: theme.surfaceDark }]}>
                      <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                      <Text style={[styles.infoText, { color: theme.textSecondary }]}>{tEditRequest('requestDetails.timingInfo')}</Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('location')}
          >
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tEditRequest('sections.location')}</Text>
            <Ionicons
              name={collapsedSections.location ? "chevron-down" : "chevron-up"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>

          {!collapsedSections.location && (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('location.cityLabel')}</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                  value={city}
                  onChangeText={setCity}
                  placeholder={tEditRequest('location.cityPlaceholder')}
                  placeholderTextColor={theme.textTertiary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('location.streetLabel')}</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                  value={street}
                  onChangeText={setStreet}
                  placeholder={tEditRequest('location.streetPlaceholder')}
                  placeholderTextColor={theme.textTertiary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('location.buildingLabel')}</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                  value={building}
                  onChangeText={setBuilding}
                  placeholder={tEditRequest('location.buildingPlaceholder')}
                  placeholderTextColor={theme.textTertiary}
                />
              </View>

              {/* Image Section */}
              <View style={styles.imageSection}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('location.imageLabel')}</Text>
                <Text style={[styles.imageDescription, { color: theme.textSecondary }]}>
                  {tEditRequest('location.imageDescription')}
                </Text>

                <View style={styles.imageGallery}>
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} style={[styles.imageContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                      <TouchableOpacity
                        style={[styles.removeImageButton, { backgroundColor: theme.background }]}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color={theme.primary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {selectedImages.length < maxImages && (
                    <TouchableOpacity style={[styles.addImageButton, { backgroundColor: theme.surfaceLight, borderColor: theme.primary }]} onPress={handlePickImage}>
                      <Ionicons name="camera-outline" size={32} color={theme.primary} />
                      <Text style={[styles.addImageText, { color: theme.primary }]}>{tEditRequest('location.addPhoto')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('budget')}
          >
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tEditRequest('sections.budget')}</Text>
            <Ionicons
              name={collapsedSections.budget ? "chevron-down" : "chevron-up"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>

          {!collapsedSections.budget && (
            <>
              <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>{tEditRequest('budget.description')}</Text>

              {/* Budget Toggle */}
              <View style={styles.budgetToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.budgetToggleButton,
                    { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                    !hasBudget && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setHasBudget(false)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={!hasBudget ? 'white' : theme.textSecondary}
                  />
                  <Text style={[
                    styles.budgetToggleText,
                    { color: theme.textSecondary },
                    !hasBudget && styles.selectedBudgetToggleText
                  ]}>
                    {tEditRequest('budget.noBudget')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.budgetToggleButton,
                    { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                    hasBudget && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setHasBudget(true)}
                >
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={hasBudget ? 'white' : theme.textSecondary}
                  />
                  <Text style={[
                    styles.budgetToggleText,
                    { color: theme.textSecondary },
                    hasBudget && styles.selectedBudgetToggleText
                  ]}>
                    {tEditRequest('budget.setBudget')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Budget Options */}
              {hasBudget && (
                <View style={styles.budgetOptions}>
                  {/* Budget Type Selection */}
                  <Text style={[styles.subSectionTitle, { color: theme.primary }]}>{tEditRequest('budget.budgetType')}</Text>
                  <View style={styles.budgetTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.budgetTypeButton,
                        { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                        budgetType === 'fixed' && { backgroundColor: theme.primary, borderColor: theme.primary }
                      ]}
                      onPress={() => setBudgetType('fixed')}
                    >
                      <Ionicons
                        name="cash-outline"
                        size={20}
                        color={budgetType === 'fixed' ? 'white' : theme.textSecondary}
                      />
                      <Text style={[
                        styles.budgetTypeText,
                        { color: theme.textSecondary },
                        budgetType === 'fixed' && styles.selectedBudgetTypeText
                      ]}>
                        {tEditRequest('budget.fixedAmount')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.budgetTypeButton,
                        { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                        budgetType === 'hourly' && { backgroundColor: theme.primary, borderColor: theme.primary }
                      ]}
                      onPress={() => setBudgetType('hourly')}
                    >
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={budgetType === 'hourly' ? 'white' : theme.textSecondary}
                      />
                      <Text style={[
                        styles.budgetTypeText,
                        { color: theme.textSecondary },
                        budgetType === 'hourly' && styles.selectedBudgetTypeText
                      ]}>
                        {tEditRequest('budget.hourlyRate')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Budget Amount Input */}
                  {budgetType === 'fixed' && (
                    <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('budget.budgetAmountLabel')}</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                        value={budgetAmount}
                        onChangeText={setBudgetAmount}
                        placeholder={tEditRequest('budget.budgetAmountPlaceholder')}
                        placeholderTextColor={theme.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                  )}

                  {/* Hourly Rate Input */}
                  {budgetType === 'hourly' && (
                    <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.textSecondary }]}>{tEditRequest('budget.hourlyRateLabel')}</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
                        value={hourlyRate}
                        onChangeText={setHourlyRate}
                        placeholder={tEditRequest('budget.hourlyRatePlaceholder')}
                        placeholderTextColor={theme.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>

        {/* Provider Selection Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('providerSelection')}
          >
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tEditRequest('sections.providerSelection')}</Text>
            <Ionicons
              name={collapsedSections.providerSelection ? "chevron-down" : "chevron-up"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>

          {!collapsedSections.providerSelection && (
            <>
              <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>{tEditRequest('providerSelection.description')}</Text>

              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                    selectionType === 'all' && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setSelectionType('all')}
                >
                  <View style={styles.optionHeader}>
                    <Ionicons
                      name="people-outline"
                      size={24}
                      color={selectionType === 'all' ? 'white' : theme.primary}
                    />
                    <Text style={[
                      styles.optionTitle,
                      { color: theme.textPrimary },
                      selectionType === 'all' && styles.selectedOptionText
                    ]}>
                      {tEditRequest('providerSelection.allProviders')}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionDescription,
                    { color: theme.textSecondary },
                    selectionType === 'all' && styles.selectedOptionDescription
                  ]}>
                    {tEditRequest('providerSelection.allProvidersDesc')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                    selectionType === 'specific' && { backgroundColor: theme.primary, borderColor: theme.primary },
                    isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory) && { opacity: 0.6 }
                  ]}
                  onPress={() => {
                    if (!isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory)) {
                      setSelectionType('specific');
                    }
                  }}
                  disabled={isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory)}
                >
                  <View style={styles.optionHeader}>
                    <Ionicons
                      name="person-outline"
                      size={24}
                      color={
                        isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory)
                          ? theme.textDisabled
                          : selectionType === 'specific'
                          ? 'white'
                          : theme.primary
                      }
                    />
                    <Text style={[
                      styles.optionTitle,
                      { color: theme.textPrimary },
                      selectionType === 'specific' && styles.selectedOptionText,
                      isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory) && { color: theme.textDisabled }
                    ]}>
                      {tEditRequest('providerSelection.specificProvider')}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionDescription,
                    { color: theme.textSecondary },
                    selectionType === 'specific' && styles.selectedOptionDescription,
                    isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory) && { color: theme.textDisabled }
                  ]}>
                    {tEditRequest('providerSelection.specificProviderDesc')}
                    {isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory) && ' - Not available for custom categories'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* No Category Selected Message */}
              {!selectedCategory && (
                <View style={[styles.infoContainer, { backgroundColor: theme.surfaceDark }]}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>Please select a category first to choose specific providers</Text>
                </View>
              )}

              {/* Specific Provider Selection */}
              {selectionType === 'specific' && !isCustomCategory(selectedCategory === 'Other' ? customCategory.trim() : selectedCategory) && selectedCategory && (
                <View style={styles.specificProviderContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.subSectionTitle, { color: theme.primary }]}>{tEditRequest('providerSelection.selectProvider')}</Text>
                    <TouchableOpacity
                      style={[styles.filterButton, { backgroundColor: theme.surfaceDark }]}
                      onPress={() => setShowRatingModal(!showRatingModal)}
                    >
                      <Ionicons name="filter" size={20} color={theme.primary} />
                      <Text style={[styles.filterButtonText, { color: theme.primary }]}>{tEditRequest('providerSelection.filter')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Rating Filter Dropdown */}
                  {showRatingModal && (
                    <View style={[styles.dropdownMenu, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      {ratingOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.dropdownOption,
                            { borderBottomColor: theme.border },
                            ratingFilter === option.value && { backgroundColor: theme.surfaceDark, borderBottomColor: theme.primary }
                          ]}
                          onPress={() => {
                            setRatingFilter(option.value);
                            setShowRatingModal(false);
                          }}
                        >
                          <Text style={[
                            styles.dropdownOptionText,
                            { color: theme.textPrimary },
                            ratingFilter === option.value && { color: theme.primary, fontWeight: 'bold' }
                          ]}>
                            {option.label}
                          </Text>
                          {ratingFilter === option.value && (
                            <Ionicons name="checkmark" size={16} color={theme.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Search Bar */}
                  <View style={styles.searchBarWrapper}>
                    <View style={[styles.searchBarContainer, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}>
                      <Ionicons name="search" size={20} color={theme.textTertiary} style={styles.searchIcon} />
                      <TextInput
                        style={[styles.searchBar, { color: theme.textPrimary }]}
                        placeholder={tEditRequest('providerSelection.searchPlaceholder')}
                        placeholderTextColor={theme.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIconBtn}>
                          <Ionicons name="close-circle" size={20} color={theme.textTertiary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Provider List */}
                  <View style={styles.providerList}>
                    {isSearching ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{tEditRequest('providerSelection.searching')}</Text>
                      </View>
                    ) : filteredProviders.length > 0 ? (
                      filteredProviders.map((provider) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          selectable={true}
                          selected={selectedProvider?.id === provider.id}
                          onSelect={handleProviderSelect}
                        />
                      ))
                    ) : (
                      <View style={styles.noResultsContainer}>
                        <Ionicons name="search-outline" size={48} color={theme.textTertiary} />
                        <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>{tEditRequest('providerSelection.noProviders')}</Text>
                        <Text style={[styles.noResultsSubtext, { color: theme.textTertiary }]}>
                          {(() => {
                            const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
                            const isCustom = isCustomCategory(finalCategory);

                            if (!finalCategory) {
                              return 'Please select a category first';
                            }

                            if (isCustom) {
                              return 'No providers available for custom categories';
                            }

                            const providersForCategory = providers.filter(
                              (provider) => provider.category === finalCategory
                            );

                            if (providersForCategory.length === 0) {
                              return `No providers found for ${finalCategory} category`;
                            } else {
                              return 'Try adjusting your search or filter criteria';
                            }
                          })()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.primary },
            isSaveDisabled && !isSaving && { backgroundColor: theme.surfaceLight, borderWidth: 1, borderColor: theme.border }
          ]}
          onPress={handleSave}
          disabled={isSaveDisabled}
        >
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                {originalStatus === 'Declined' ? tEditRequest('resending') : tEditRequest('saving')}
              </Text>
            </>
          ) : (
            <>
              <Text style={[
                styles.saveButtonText,
                { color: isSaveDisabled ? theme.textDisabled : 'white' }
              ]}>
                {originalStatus === 'Declined' ? tEditRequest('resend') : tEditRequest('saveChanges')}
              </Text>
              <Ionicons
                name="checkmark"
                size={20}
                color={isSaveDisabled ? theme.textDisabled : 'white'}
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Common Styles
  commonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  commonTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  commonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  commonSelectedButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  commonButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  commonSelectedButtonText: {
    color: 'white',
  },
  commonCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  commonSelectedCard: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },

  // Layout Styles
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // Header Styles for Stack Navigator
  headerStyle: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginRight: 16,
  },
  textSave: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  textSaveDisabled: {
    color: '#ccc',
  },

  // Section Styles
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 4,
  },

  // Info Container
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  infoText: {
    marginHorizontal: 8,
    fontSize: 13,
    color: '#666',
  },

  // Input Styles
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Category Styles
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryItem: {
    width: (wp(100) - 60) / 2,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  iconContainer: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: 'white',
  },
  customInputContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  customInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },

  // Image Styles
  imageSection: {
    marginBottom: 30,
  },
  imageDescription: {
    fontSize: 14,
    color: '#666',
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
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
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
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  addImageText: {
    marginTop: 8,
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },

  // Provider Selection Styles
  optionsContainer: {
    marginBottom: 30,
  },
  optionCard: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  selectedOptionCard: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 36,
  },
  selectedOptionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  specificProviderContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#007bff',
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 5,
    zIndex: 1000,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionSelected: {
    backgroundColor: '#e0f2fe',
    borderBottomColor: '#007bff',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownOptionTextSelected: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  searchBarWrapper: {
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIconBtn: {
    marginLeft: 4,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 0,
    color: '#000',
  },
  providerList: {
    marginBottom: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },

  // Timing Styles
  timingSection: {
    marginTop: 20,
  },
  timingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timingTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 5,
  },
  selectedTimingType: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timingTypeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  selectedTimingTypeText: {
    color: 'white',
  },
  flexibleOptions: {
    marginTop: 15,
  },
  subLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: 'white',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  timeSlotCard: {
    width: (wp(100) - 60) / 2,
    aspectRatio: 1.2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  selectedTimeSlotCard: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  timeSlotIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timeSlotTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedTimeSlotText: {
    color: '#007bff',
  },

  // Budget Styles
  budgetToggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  budgetToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  selectedBudgetToggle: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  budgetToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  selectedBudgetToggleText: {
    color: 'white',
  },
  budgetOptions: {
    marginTop: 20,
  },
  budgetTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  budgetTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  selectedBudgetType: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  budgetTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  selectedBudgetTypeText: {
    color: 'white',
  },

  // Save Button Styles
  saveButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  saveButtonTextDisabled: {
    color: '#ccc',
  },
});

export default EditUserRequest;
