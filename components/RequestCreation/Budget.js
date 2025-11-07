import React, { useState, useMemo, useEffect } from 'react';
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

const Budget = ({
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
  validateForm = true,
  // Group request props
  groupId = null,
}) => {
  const { theme } = useTheme();
  const { tBudget } = useTranslation();

  const [hasBudget, setHasBudget] = useState(contextState?.budget?.hasBudget || false);
  const [budgetType, setBudgetType] = useState(contextState?.budget?.type || 'fixed'); // 'fixed', 'hourly', 'professional'
  const [budgetAmount, setBudgetAmount] = useState(
    contextState?.budget?.amount > 0 ? contextState?.budget?.amount.toString() : ''
  );
  const [hourlyRate, setHourlyRate] = useState(
    contextState?.budget?.hourlyRate > 0 ? contextState?.budget?.hourlyRate.toString() : ''
  );

  // Save data to context immediately when user changes values
  useEffect(() => {
    if (contextDispatch) {
      contextDispatch({
        type: 'SET_BUDGET',
        payload: {
          hasBudget,
          type: hasBudget ? budgetType : 'none',
          amount: hasBudget && budgetType === 'fixed' ? parseFloat(budgetAmount) || 0 : 0,
          hourlyRate: hasBudget && budgetType === 'hourly' ? parseFloat(hourlyRate) || 0 : 0,
        },
      });
    }
  }, [hasBudget, budgetType, budgetAmount, hourlyRate, contextDispatch]);

  const handleNext = () => {
    if (validateForm) {
      if (hasBudget && budgetType !== 'fixed' && budgetType !== 'hourly') {
        Alert.alert('Error', tBudget('errors.selectBudgetType'));
        return;
      }

      if (hasBudget && budgetType === 'fixed' && !budgetAmount.trim()) {
        Alert.alert('Error', tBudget('errors.enterBudgetAmount'));
        return;
      }

      if (hasBudget && budgetType === 'hourly' && !hourlyRate.trim()) {
        Alert.alert('Error', tBudget('errors.enterHourlyRate'));
        return;
      }

      if (hasBudget && budgetType === 'fixed' && parseFloat(budgetAmount) <= 0) {
        Alert.alert('Error', tBudget('errors.validBudgetAmount'));
        return;
      }

      if (hasBudget && budgetType === 'hourly' && parseFloat(hourlyRate) <= 0) {
        Alert.alert('Error', tBudget('errors.validHourlyRate'));
        return;
      }
    }

    // Data is already saved by useEffect, just proceed to next screen
    if (onNext) {
      onNext({
        hasBudget,
        type: hasBudget ? budgetType : 'none',
        amount: hasBudget && budgetType === 'fixed' ? parseFloat(budgetAmount) : 0,
        hourlyRate: hasBudget && budgetType === 'hourly' ? parseFloat(hourlyRate) : 0,
      });
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const isNextDisabled =
    hasBudget &&
    ((budgetType === 'fixed' && !budgetAmount.trim()) ||
      (budgetType === 'hourly' && !hourlyRate.trim()) ||
      (budgetType !== 'fixed' && budgetType !== 'hourly'));

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
        budgetTypeContainer: {
          marginBottom: 30,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 15,
          color: theme.textPrimary,
        },
        budgetTypeOptions: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        },
        budgetTypeCard: {
          width: wp(44),
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: 12,
          padding: 20,
          marginBottom: 15,
          backgroundColor: theme.surfaceLight,
        },
        selectedBudgetTypeCard: {
          borderColor: theme.primary,
          backgroundColor: theme.primary,
        },
        budgetTypeHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        budgetTypeTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: 12,
          color: theme.textPrimary,
        },
        selectedBudgetTypeText: {
          color: '#FFFFFF',
        },
        budgetTypeDescription: {
          fontSize: 13,
          color: theme.textSecondary,
          marginLeft: 36,
        },
        selectedBudgetTypeDescription: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        budgetInputContainer: {
          marginBottom: 30,
        },
        label: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textSecondary,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        amountInputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: theme.surfaceLight,
        },
        currencySymbol: {
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.textPrimary,
          marginRight: 8,
        },
        amountInput: {
          flex: 1,
          fontSize: 18,
          paddingVertical: 12,
          color: theme.textPrimary,
        },
        budgetNote: {
          fontSize: 12,
          color: theme.textSecondary,
          marginTop: 8,
          fontStyle: 'italic',
        },
        perHourText: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textPrimary,
          marginLeft: 8,
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
          <Text style={styles.headerTitle}>{headerTitle || tBudget('title')}</Text>
        </View>

        {/* Right section: Cancel + Next */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={styles.textCancel}>{tBudget('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={isNextDisabled}
            style={[styles.headerButton, { opacity: isNextDisabled ? 0.5 : 1 }]}
          >
            <Text style={[styles.textNext, { color: isNextDisabled ? theme.textDisabled : theme.primary }]}>
              {tBudget('next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Message */}
        {groupId && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>{tBudget('groupWorkMessage')} {groupId}</Text>
          </View>
        )}

        <Text style={styles.description}>{description || tBudget('description')}</Text>

        {/* First Level: Budget vs No Budget */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionCard, hasBudget && styles.selectedOptionCard]}
            onPress={() => setHasBudget(true)}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="card-outline"
                size={24}
                color={hasBudget ? '#FFFFFF' : theme.primary}
              />
              <Text style={[styles.optionTitle, hasBudget && styles.selectedOptionText]}>{tBudget('setBudget')}</Text>
            </View>
            <Text style={[styles.optionDescription, hasBudget && styles.selectedOptionDescription]}>
              {tBudget('setBudgetDescription')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, !hasBudget && styles.selectedOptionCard]}
            onPress={() => setHasBudget(false)}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="infinite-outline"
                size={24}
                color={!hasBudget ? '#FFFFFF' : theme.textSecondary}
              />
              <Text style={[styles.optionTitle, !hasBudget && styles.selectedOptionText]}>{tBudget('noBudget')}</Text>
            </View>
            <Text style={[styles.optionDescription, !hasBudget && styles.selectedOptionDescription]}>
              {tBudget('noBudgetDescription')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Second Level: Budget Type Selection */}
        {hasBudget && (
          <View style={styles.budgetTypeContainer}>
            <Text style={styles.sectionTitle}>{tBudget('howToSetBudget')}</Text>

            <View style={styles.budgetTypeOptions}>
              <TouchableOpacity
                style={[styles.budgetTypeCard, budgetType === 'fixed' && styles.selectedBudgetTypeCard]}
                onPress={() => setBudgetType('fixed')}
              >
                <View style={styles.budgetTypeHeader}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={budgetType === 'fixed' ? '#FFFFFF' : theme.primary}
                  />
                  <Text style={[styles.budgetTypeTitle, budgetType === 'fixed' && styles.selectedBudgetTypeText]}>
                    {tBudget('fixedAmount')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.budgetTypeDescription,
                    budgetType === 'fixed' && styles.selectedBudgetTypeDescription,
                  ]}
                >
                  {tBudget('fixedAmountDescription')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.budgetTypeCard, budgetType === 'hourly' && styles.selectedBudgetTypeCard]}
                onPress={() => setBudgetType('hourly')}
              >
                <View style={styles.budgetTypeHeader}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={budgetType === 'hourly' ? '#FFFFFF' : theme.primary}
                  />
                  <Text style={[styles.budgetTypeTitle, budgetType === 'hourly' && styles.selectedBudgetTypeText]}>
                    {tBudget('hourlyRate')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.budgetTypeDescription,
                    budgetType === 'hourly' && styles.selectedBudgetTypeDescription,
                  ]}
                >
                  {tBudget('hourlyRateDescription')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Fixed Budget Input */}
        {hasBudget && budgetType === 'fixed' && (
          <View style={styles.budgetInputContainer}>
            <Text style={styles.label}>{tBudget('totalBudgetAmount')}</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                placeholder="0.00"
                placeholderTextColor={theme.textDisabled}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.budgetNote}>
              {tBudget('budgetNote')}
            </Text>
          </View>
        )}

        {/* Hourly Rate Input */}
        {hasBudget && budgetType === 'hourly' && (
          <View style={styles.budgetInputContainer}>
            <Text style={styles.label}>{tBudget('hourlyRateLabel')}</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="0.00"
                placeholderTextColor={theme.textDisabled}
                keyboardType="numeric"
              />
              <Text style={styles.perHourText}>{tBudget('perHour')}</Text>
            </View>
            <Text style={styles.budgetNote}>{tBudget('hourlyRateNote')}</Text>
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]} 
          onPress={handleNext} 
          disabled={isNextDisabled}
        >
          <Text style={[styles.nextButtonText, isNextDisabled && styles.nextButtonTextDisabled]}>
            {tBudget('next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={isNextDisabled ? theme.textDisabled : '#FFFFFF'} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Budget;
