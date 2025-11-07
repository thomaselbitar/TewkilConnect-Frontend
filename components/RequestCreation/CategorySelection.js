import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import { categories as centralizedCategories, getCategoryTranslation } from '../../Data/CategoryandTag';

const CategorySelection = ({
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
  // Validation props
  validateSelection = true,
  // Custom categories data
  customCategories = null,
  // Group request props
  groupId = null,
}) => {
  const { theme } = useTheme();
  const { tCategories, tRequest, tCommon } = useTranslation();

  // Set default values for headerTitle and description if not provided
  const finalHeaderTitle = headerTitle || tRequest('selectCategory');
  const finalDescription = description || tRequest('categoryDescription');

  const getCategoryText = (categoryTitle) => {
    return getCategoryTranslation(categoryTitle, tCategories);
  };

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isUserSelecting, setIsUserSelecting] = useState(false);

  // Use custom categories if provided, otherwise use centralized categories
  const baseCategories = customCategories || centralizedCategories;
  
  // Add "Other" option to allow custom category input
  const categories = [
    ...baseCategories,
    { id: 'other', title: 'Other', iconName: 'add-circle-outline' }
  ];

  // Initialize state from context when component mounts or context changes
  React.useEffect(() => {
    // Only initialize from context if user is not actively selecting
    if (!isUserSelecting) {
      const contextCategory = contextState?.category || '';

      if (contextCategory) {
        const isDefaultCategory = categories.some((cat) => cat.title === contextCategory);

        if (isDefaultCategory) {
          setSelectedCategory(contextCategory);
          setShowCustomInput(false);
          setCustomCategory('');
        } else {
          setSelectedCategory('Other');
          setShowCustomInput(true);
          setCustomCategory(contextCategory);
        }
      } else {
        // Reset local state when context category is empty
        setSelectedCategory('');
        setShowCustomInput(false);
        setCustomCategory('');
      }
    }
  }, [contextState?.category, categories, isUserSelecting]);

  const handleCategorySelect = (category) => {
    setIsUserSelecting(true);
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
    setIsUserSelecting(true);
    setCustomCategory(text);
  };

  const handleBackOrCancel = () => {
    const hasCategorySelected =
      selectedCategory && (selectedCategory !== 'Other' || selectedCategory === 'Other');

    if (hasCategorySelected) {
      Alert.alert(tRequest('cancelRequest'), tRequest('cancelConfirm'), [
        { text: tRequest('keepEditing'), style: 'cancel' },
        {
          text: tCommon('cancel'),
          style: 'destructive',
          onPress: () => {
            setIsUserSelecting(false);
            if (onCancel) onCancel();
          },
        },
      ]);
    } else {
      setIsUserSelecting(false);
      if (onCancel) onCancel();
    }
  };

  const handleNext = () => {
    if (validateSelection) {
      if (!selectedCategory) {
        Alert.alert(tCommon('error'), tRequest('selectCategory'));
        return;
      }
      if (selectedCategory === 'Other' && !customCategory.trim()) {
        Alert.alert(tCommon('error'), tRequest('enterCustomCategory'));
        return;
      }
    }

    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;

    if (contextDispatch) {
      contextDispatch({ type: 'SET_CATEGORY', payload: finalCategory });
    }

    // Reset the user selecting flag when navigating away
    setIsUserSelecting(false);

    if (onNext) onNext(finalCategory);
  };

  const isNextDisabled = !selectedCategory || (selectedCategory === 'Other' && !customCategory.trim());

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },

        /** HEADER **/
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
          alignItems: 'center',
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

        /** MAIN CONTENT **/
        content: {
          flex: 1,
          padding: 20,
        },
        contentWithCustom: {
          paddingBottom: 0,
        },
        description: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: 30,
          textAlign: 'center',
        },

        /** GROUP MESSAGE **/
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

        /** CATEGORY GRID **/
        categoriesGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        categoryItem: {
          width: (wp(100) - 60) / 2,
          backgroundColor: theme.surfaceLight,
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.border,
          justifyContent: 'center',
        },
        selectedCategory: {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        },
        iconContainer: {
          marginBottom: 8,
        },
        categoryText: {
          fontSize: 14,
          fontWeight: '500',
          color: theme.textPrimary,
          textAlign: 'center',
        },
        selectedCategoryText: {
          color: '#FFFFFF',
        },

        /** CUSTOM CATEGORY INPUT **/
        customInputContainer: {
          marginTop: 10,
          marginBottom: 20,
          padding: 20,
          backgroundColor: theme.surfaceLight,
          borderRadius: 10,
        },
        customInputLabel: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textSecondary,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        customInput: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          backgroundColor: theme.cardBackground,
          color: theme.textPrimary,
        },

        /** NEXT BUTTON **/
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
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        {/* Left section: Back arrow + title */}
        <View style={styles.leftGroup}>
          <TouchableOpacity onPress={handleBackOrCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{finalHeaderTitle}</Text>
        </View>

        {/* Right section: Cancel + Next */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={handleBackOrCancel} style={styles.headerButton}>
            <Text style={styles.textCancel}>{tCommon('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={isNextDisabled}
            style={[styles.headerButton, { opacity: isNextDisabled ? 0.5 : 1 }]}
          >
            <Text style={[styles.textNext, { color: isNextDisabled ? theme.textDisabled : theme.primary }]}>
              {tCommon('next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={showCustomInput ? styles.contentWithCustom : null}
      >
        {/* Group Message */}
        {groupId && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>{tRequest('groupWorkMessage')} {groupId}</Text>
          </View>
        )}

        {/* Description */}
        <Text style={styles.description}>{finalDescription}</Text>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category.title ||
              (category.title === 'Other' && selectedCategory === 'Other');

            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryItem, isSelected && styles.selectedCategory]}
                onPress={() => handleCategorySelect(category)}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={category.iconName}
                    size={24}
                    color={isSelected ? '#FFFFFF' : theme.primary}
                  />
                </View>
                <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                  {getCategoryText(category.title)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Category Input */}
        {showCustomInput && (
          <View style={styles.customInputContainer}>
            <Text style={styles.customInputLabel}>{tRequest('customCategory')}</Text>
            <TextInput
              style={styles.customInput}
              value={customCategory}
              onChangeText={handleCustomCategoryChange}
              placeholder={tRequest('enterCategoryName')}
              placeholderTextColor={theme.textDisabled}
              autoFocus
            />
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isNextDisabled}
        >
          <Text style={[styles.nextButtonText, isNextDisabled && styles.nextButtonTextDisabled]}>{tCommon('next')}</Text>
          <Ionicons name="arrow-forward" size={20} color={isNextDisabled ? theme.textDisabled : '#FFFFFF'} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CategorySelection;
