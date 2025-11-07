import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const ProviderCategorySelection = ({
  onNext,
  onBack,
  onCancel,
  selectedProvider,
  contextState,
  contextDispatch,
}) => {
  const { theme } = useTheme();
  const { tRequest, tCommon } = useTranslation();
  
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get provider's main category only
  const getProviderCategories = (provider) => {
    const baseCategory = provider?.category || '';
    
    // Return only the provider's main category
    return [{ id: '1', title: baseCategory, iconName: 'construct-outline' }];
  };

  const providerCategories = getProviderCategories(selectedProvider);

  // Initialize state from context when component mounts
  useEffect(() => {
    const contextCategory = contextState?.category || '';
    if (contextCategory && providerCategories.some(cat => cat.title === contextCategory)) {
      setSelectedCategory(contextCategory);
    }
  }, [contextState?.category, providerCategories]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.title);
  };

  const handleNext = () => {
    if (!selectedCategory) {
      Alert.alert(tCommon('error'), tRequest('selectCategory'));
      return;
    }

    // Update context with selected category
    if (contextDispatch) {
      contextDispatch({ type: 'SET_CATEGORY', payload: selectedCategory });
    }

    onNext(selectedCategory);
  };

  const handleBack = () => {
    // Go back to request type selection without showing alert
    if (onBack) onBack();
  };

  const handleCancel = () => {
    // Show alert and cancel the entire request
    Alert.alert(tRequest('cancelRequest'), tRequest('cancelConfirm'), [
      { text: tRequest('keepEditing'), style: 'cancel' },
      {
        text: tCommon('cancel'),
        style: 'destructive',
        onPress: () => {
          if (onCancel) onCancel();
        },
      },
    ]);
  };

  const isNextDisabled = !selectedCategory;

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
        description: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: 30,
          textAlign: 'center',
        },

        /** PROVIDER INFO **/
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{tRequest('selectCategory')}</Text>
        </View>

        {/* Right section: Cancel + Next */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
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
      >
        {/* Provider Info */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>
            {tRequest('availableCategoriesFor')} {selectedProvider?.name}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {tRequest('chooseServiceCategoryDescription')} {selectedProvider?.name}
        </Text>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {providerCategories.map((category) => {
            const isSelected = selectedCategory === category.title;

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
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isNextDisabled}
        >
          <Text style={[styles.nextButtonText, isNextDisabled && styles.nextButtonTextDisabled]}>
            {tCommon('next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={isNextDisabled ? theme.textDisabled : '#FFFFFF'} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProviderCategorySelection;