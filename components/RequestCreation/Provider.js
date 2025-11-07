import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wp, hp } from '../../utils/helpers';
import ProviderCard from '../Card/ProviderCards/ProviderCard';
import { providers } from '../../Data/Data';
import { categories } from '../../Data/CategoryandTag';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const Provider = ({
  // Context props
  contextState,
  contextDispatch,
  // Navigation props
  onBack,
  onNext,
  onCancel,
  // UI props
  headerTitle,
  description,
  // Data props
  providerData = providers,
  // Validation props
  validateForm = true,
  // Group request props
  groupId = null,
}) => {
  const { theme } = useTheme();
  const { tProviders } = useTranslation();

  const [selectionType, setSelectionType] = useState(contextState?.providerSelection?.type || 'all');
  const [selectedProvider, setSelectedProvider] = useState(contextState?.providerSelection?.selectedProvider);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0); // 0 = no filter, 1-5 = minimum rating
  const [showRatingModal, setShowRatingModal] = useState(false);
  const searchTimeout = useRef();

  const ratingOptions = [
    { value: 0, label: tProviders('ratingFilters.allRatings'), min: 0, max: 5 },
    { value: 1, label: tProviders('ratingFilters.oneTwoStars'), min: 1, max: 2 },
    { value: 2, label: tProviders('ratingFilters.twoThreeStars'), min: 2, max: 3 },
    { value: 3, label: tProviders('ratingFilters.threeFourStars'), min: 3, max: 4 },
    { value: 4, label: tProviders('ratingFilters.fourFiveStars'), min: 4, max: 5 },
    { value: 5, label: tProviders('ratingFilters.fiveStars'), min: 5, max: 5 },
  ];

  const selectedRatingOption = ratingOptions.find((option) => option.value === ratingFilter);

  // Helper function to check if category is custom
  const isCustomCategory = (category) => {
    return category && !categories.some((cat) => cat.title === category);
  };

  // Filter providers based on search query, rating, and category
  const filteredProviders = (() => {
    const selectedCategory = contextState?.category || '';
    
    // If no category is selected, return empty array (user can't proceed anyway)
    if (!selectedCategory) {
      return [];
    }
    
    // If it's a custom category, return empty array (specific provider option is disabled)
    if (isCustomCategory(selectedCategory)) {
      return [];
    }
    
    // Only filter providers for predefined categories
    return providerData.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchQuery.toLowerCase());

      const selectedOption = ratingOptions.find((option) => option.value === ratingFilter);
      const matchesRating =
        ratingFilter === 0 ||
        (provider.rating >= selectedOption.min && provider.rating < selectedOption.max);

      // Filter by category - only show providers that match the selected category
      const matchesCategory = provider.category === selectedCategory;

      return matchesSearch && matchesRating && matchesCategory;
    });
  })();

  useEffect(() => {
    // Simulate loading time for providers
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Auto-select 'all' providers for custom categories and reset invalid selections
  useEffect(() => {
    const selectedCategory = contextState?.category || '';

    if (isCustomCategory(selectedCategory)) {
      setSelectionType('all');
      setSelectedProvider(null);
    } else if (selectedCategory && selectedProvider) {
      // Check if the currently selected provider is still valid for the new category
      const isProviderValid = selectedProvider.category === selectedCategory;

      if (!isProviderValid) {
        // Reset to 'all' if the selected provider doesn't match the new category
        setSelectionType('all');
        setSelectedProvider(null);
      }
    }
  }, [contextState?.category, selectedProvider]);

  // Search logic with spinner
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        setIsSearching(false);
      }, 400); // 400ms search delay
      return () => clearTimeout(searchTimeout.current);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleNext = () => {
    if (validateForm) {
      if (selectionType === 'specific' && !selectedProvider) {
        Alert.alert('Error', tProviders('errors.selectProvider'));
        return;
      }
    }

    // Save to context if available
    if (contextDispatch) {
      contextDispatch({
        type: 'SET_PROVIDER_SELECTION',
        payload: {
          type: selectionType,
          selectedProvider: selectionType === 'specific' ? selectedProvider : null,
        },
      });
    }

    // Call onNext with the provider selection data
    if (onNext) {
      onNext({
        type: selectionType,
        selectedProvider: selectionType === 'specific' ? selectedProvider : null,
      });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const isNextDisabled = selectionType === 'specific' && !selectedProvider;

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
        description: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: 30,
          textAlign: 'center',
        },
        optionsContainer: {
          marginBottom: 30,
        },
        optionCard: {
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: 12,
          padding: 20,
          marginBottom: 15,
          backgroundColor: theme.surfaceLight,
        },
        selectedOptionCard: {
          borderColor: theme.primary,
          backgroundColor: theme.primary,
        },
        disabledOptionCard: {
          borderColor: theme.border,
          backgroundColor: theme.surfaceLight,
          opacity: 0.6,
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
          color: theme.textPrimary,
        },
        selectedOptionText: {
          color: '#FFFFFF',
        },
        optionDescription: {
          fontSize: 14,
          color: theme.textSecondary,
          marginLeft: 36,
        },
        selectedOptionDescription: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        disabledOptionText: {
          color: theme.textDisabled,
        },
        disabledOptionDescription: {
          color: theme.textDisabled,
        },
        specificProviderContainer: {
          marginBottom: 30,
          position: 'relative',
        },
        sectionHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        },
        sectionTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.primary,
          marginBottom: 4,
        },
        filterButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surfaceDark,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 10,
        },
        filterButtonText: {
          fontSize: 14,
          color: theme.primary,
          marginLeft: 4,
        },
        dropdownMenu: {
          position: 'absolute',
          top: 50,
          right: 0,
          backgroundColor: theme.cardBackground,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.border,
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
          borderBottomColor: theme.border,
        },
        dropdownOptionSelected: {
          backgroundColor: theme.surfaceDark,
          borderBottomColor: theme.primary,
        },
        dropdownOptionText: {
          fontSize: 15,
          color: theme.textPrimary,
        },
        dropdownOptionTextSelected: {
          fontWeight: 'bold',
          color: theme.primary,
        },
        searchBarWrapper: {
          marginBottom: 20,
        },
        searchBarContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surfaceLight,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
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
          color: theme.textPrimary,
        },
        providerList: {
          marginBottom: 20,
        },
        loadingContainer: {
          alignItems: 'center',
          paddingVertical: 40,
        },
        loadingText: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textSecondary,
          marginTop: 12,
        },
        noResultsContainer: {
          alignItems: 'center',
          paddingVertical: 40,
        },
        noResultsText: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textSecondary,
          marginTop: 12,
        },
        noResultsSubtext: {
          fontSize: 14,
          color: theme.textDisabled,
          marginTop: 4,
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
        nextButtonDisabled: {
          backgroundColor: theme.surfaceLight,
          borderWidth: 1,
          borderColor: theme.border,
        },
        nextButtonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 'bold',
          marginRight: 8,
        },
        nextButtonTextDisabled: {
          color: theme.textDisabled,
        },
        searchSpinnerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 10,
        },
        searchSpinnerText: {
          marginLeft: 8,
          fontSize: 14,
          color: theme.primary,
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
          <Text style={styles.headerTitle}>{headerTitle || tProviders('providerSelection')}</Text>
        </View>

        {/* Right section: Cancel + Next */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={styles.textCancel}>{tProviders('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={isNextDisabled}
            style={[styles.headerButton, { opacity: isNextDisabled ? 0.5 : 1 }]}
          >
            <Text style={[styles.textNext, { color: isNextDisabled ? theme.textDisabled : theme.primary }]}>
              {tProviders('next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Message */}
        {groupId && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>{tProviders('groupWorkMessage')} {groupId}</Text>
          </View>
        )}

        <Text style={styles.description}>{description || tProviders('providerSelectionDescription')}</Text>

        {/* Selection Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionCard, selectionType === 'all' && styles.selectedOptionCard]}
            onPress={() => setSelectionType('all')}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="people-outline"
                size={24}
                color={selectionType === 'all' ? '#FFFFFF' : theme.primary}
              />
              <Text style={[styles.optionTitle, selectionType === 'all' && styles.selectedOptionText]}>
                {tProviders('allProviders')}
              </Text>
            </View>
            <Text
              style={[
                styles.optionDescription,
                selectionType === 'all' && styles.selectedOptionDescription,
              ]}
            >
              {tProviders('allProvidersDescription')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectionType === 'specific' && styles.selectedOptionCard,
              isCustomCategory(contextState?.category) && styles.disabledOptionCard,
            ]}
            onPress={() => {
              if (!isCustomCategory(contextState?.category)) {
                setSelectionType('specific');
              }
            }}
            disabled={isCustomCategory(contextState?.category)}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="person-outline"
                size={24}
                color={
                  isCustomCategory(contextState?.category)
                    ? theme.textDisabled
                    : selectionType === 'specific'
                    ? '#FFFFFF'
                    : theme.primary
                }
              />
              <Text
                style={[
                  styles.optionTitle,
                  selectionType === 'specific' && styles.selectedOptionText,
                  isCustomCategory(contextState?.category) && styles.disabledOptionText,
                ]}
              >
                {tProviders('specificProvider')}
              </Text>
            </View>
            <Text
              style={[
                styles.optionDescription,
                selectionType === 'specific' && styles.selectedOptionDescription,
                isCustomCategory(contextState?.category) && styles.disabledOptionDescription,
              ]}
            >
              {tProviders('specificProviderDescription')}
              {isCustomCategory(contextState?.category) && tProviders('notAvailableForCustom')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* No Category Selected Message */}
        {!contextState?.category && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>{tProviders('selectCategoryFirstMessage')}</Text>
          </View>
        )}

        {/* Search and Provider List */}
        {selectionType === 'specific' && !isCustomCategory(contextState?.category) && contextState?.category && (
          <View style={styles.specificProviderContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{tProviders('selectProviderTitle')}</Text>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowRatingModal(!showRatingModal)}
              >
                <Ionicons name="filter" size={20} color={theme.primary} />
                <Text style={styles.filterButtonText}>{tProviders('filter')}</Text>
              </TouchableOpacity>
            </View>

            {/* Rating Filter Dropdown */}
            {showRatingModal && (
              <View style={styles.dropdownMenu}>
                {ratingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownOption,
                      ratingFilter === option.value && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      setRatingFilter(option.value);
                      setShowRatingModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        ratingFilter === option.value && styles.dropdownOptionTextSelected,
                      ]}
                    >
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
              <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchBar}
                  placeholder={tProviders('searchProviders')}
                  placeholderTextColor={theme.textDisabled}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIconBtn}>
                    <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Search Spinner */}
            {isSearching && (
              <View style={styles.searchSpinnerContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={styles.searchSpinnerText}>{tProviders('searching')}</Text>
              </View>
            )}

            {/* Provider List */}
            <View style={styles.providerList}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={styles.loadingText}>{tProviders('loadingProviders')}</Text>
                </View>
              ) : isSearching ? null : filteredProviders.length > 0 ? (
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
                  <Ionicons name="search-outline" size={48} color={theme.textDisabled} />
                  <Text style={styles.noResultsText}>{tProviders('noProvidersFoundMessage')}</Text>
                  <Text style={styles.noResultsSubtext}>
                    {(() => {
                      const selectedCategory = contextState?.category || '';
                      const isCustom = isCustomCategory(selectedCategory);

                      if (!selectedCategory) {
                        return tProviders('selectCategoryFirst');
                      }

                      if (isCustom) {
                        return tProviders('noProvidersForCustomCategory');
                      }

                      const providersForCategory = providerData.filter(
                        (provider) => provider.category === selectedCategory
                      );

                      if (providersForCategory.length === 0) {
                        return tProviders('noProvidersForCategory').replace('{category}', selectedCategory);
                      } else {
                        return tProviders('tryAdjustingSearch');
                      }
                    })()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={isNextDisabled}
        >
          <Text style={[styles.nextButtonText, isNextDisabled && styles.nextButtonTextDisabled]}>
            {tProviders('next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={isNextDisabled ? theme.textDisabled : '#FFFFFF'} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Provider;
