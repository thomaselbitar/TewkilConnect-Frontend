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

const RequestDetails = ({
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
  // Group request props
  groupId = null,
}) => {
  const { theme } = useTheme();
  const { t, tRequestDetails, tRequestCreation, tCommon } = useTranslation();

  const [title, setTitle] = useState(contextState?.title || '');
  const [description, setDescription] = useState(contextState?.description || '');
  const [timingType, setTimingType] = useState(contextState?.timing?.type || '');
  const [selectedDay, setSelectedDay] = useState(contextState?.timing?.day || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(contextState?.timing?.timeSlot || '');

  // Save data to context immediately when user types
  useEffect(() => {
    if (contextDispatch) {
      // Save title and description
      if (title !== contextState?.title) {
        contextDispatch({ type: 'SET_TITLE', payload: title });
      }
      if (description !== contextState?.description) {
        contextDispatch({ type: 'SET_DESCRIPTION', payload: description });
      }
      
      // Save timing data
      if (timingType !== contextState?.timing?.type) {
        contextDispatch({ type: 'SET_TIMING_TYPE', payload: timingType });
      }
      if (selectedDay !== contextState?.timing?.day) {
        contextDispatch({ type: 'SET_TIMING_DAY', payload: selectedDay });
      }
      if (selectedTimeSlot !== contextState?.timing?.timeSlot) {
        contextDispatch({ type: 'SET_TIMING_SLOT', payload: selectedTimeSlot });
      }
    }
  }, [title, description, timingType, selectedDay, selectedTimeSlot, contextDispatch, contextState]);

  const days = [
    { key: 'Monday', label: t('requestDetails.days.monday') },
    { key: 'Tuesday', label: t('requestDetails.days.tuesday') },
    { key: 'Wednesday', label: t('requestDetails.days.wednesday') },
    { key: 'Thursday', label: t('requestDetails.days.thursday') },
    { key: 'Friday', label: t('requestDetails.days.friday') },
    { key: 'Saturday', label: t('requestDetails.days.saturday') },
    { key: 'Sunday', label: t('requestDetails.days.sunday') }
  ];
  const timeSlots = [
    { key: 'Morning', label: t('requestDetails.timeSlots.morning') },
    { key: 'Midday', label: t('requestDetails.timeSlots.midday') },
    { key: 'Afternoon', label: t('requestDetails.timeSlots.afternoon') },
    { key: 'Evening', label: t('requestDetails.timeSlots.evening') }
  ];

  const handleNext = () => {
    if (validateForm) {
      if (!title.trim()) {
        Alert.alert(tCommon('error'), t('requestDetails.errors.enterTitle'));
        return;
      }

      if (!description.trim()) {
        Alert.alert(tCommon('error'), t('requestDetails.errors.enterDescription'));
        return;
      }

      if (!timingType) {
        Alert.alert(tCommon('error'), t('requestDetails.errors.selectTiming'));
        return;
      }

      if (timingType === 'flexible' && (!selectedDay || !selectedTimeSlot)) {
        Alert.alert(tCommon('error'), t('requestDetails.errors.selectDayAndTime'));
        return;
      }
    }

    if (contextDispatch) {
      contextDispatch({ type: 'SET_TITLE', payload: title.trim() });
      contextDispatch({ type: 'SET_DESCRIPTION', payload: description.trim() });
      contextDispatch({ type: 'SET_TIMING_TYPE', payload: timingType });

      if (timingType === 'flexible') {
        contextDispatch({ type: 'SET_TIMING_DAY', payload: selectedDay });
        contextDispatch({ type: 'SET_TIMING_SLOT', payload: selectedTimeSlot });
      }
    }

    if (onNext) {
      onNext({
        title: title.trim(),
        description: description.trim(),
        timing: {
          type: timingType,
          day: selectedDay,
          timeSlot: selectedTimeSlot,
        },
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

  const isNextDisabled =
    !title.trim() ||
    !description.trim() ||
    !timingType ||
    (timingType === 'flexible' && (!selectedDay || !selectedTimeSlot));

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
        textArea: {
          height: 100,
          textAlignVertical: 'top',
        },
        section: {
          marginBottom: 30,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 15,
          color: theme.textPrimary,
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
          borderColor: theme.border,
          backgroundColor: theme.surfaceLight,
          marginHorizontal: 5,
        },
        selectedTimingType: {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        },
        timingTypeText: {
          marginLeft: 8,
          fontSize: 16,
          fontWeight: '500',
          color: theme.textSecondary,
        },
        selectedTimingTypeText: {
          color: '#FFFFFF',
        },
        flexibleOptions: {
          marginTop: 15,
        },
        subLabel: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textSecondary,
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
          borderColor: theme.border,
          backgroundColor: theme.surfaceLight,
          marginRight: 8,
          marginBottom: 8,
        },
        selectedOption: {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        },
        optionText: {
          fontSize: 14,
          color: theme.textSecondary,
        },
        selectedOptionText: {
          color: '#FFFFFF',
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
          borderColor: theme.border,
          backgroundColor: theme.surfaceLight,
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        },
        selectedTimeSlotCard: {
          borderColor: theme.primary,
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
          color: theme.textSecondary,
        },
        selectedTimeSlotText: {
          color: theme.primary,
        },
        infoContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surfaceDark,
          borderRadius: 8,
          marginBottom: 20,
          padding: 10,
        },
        infoText: {
          marginHorizontal: 8,
          fontSize: 13,
          color: theme.textSecondary,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Left section: Back arrow + title */}
        <View style={styles.leftGroup}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle || t('requestDetails.title')}</Text>
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
            <Text
              style={[
                styles.textNext,
                { color: isNextDisabled ? theme.textDisabled : theme.primary },
              ]}
            >
              {tCommon('next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Message */}
        {groupId && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>
              {tRequestCreation('groupWorkMessage')} {groupId}
            </Text>
          </View>
        )}

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('requestDetails.titleLabel')} *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder={t('requestDetails.placeholders.title')}
            placeholderTextColor={theme.textDisabled}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('requestDetails.descriptionLabel')} *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('requestDetails.placeholders.description')}
            placeholderTextColor={theme.textDisabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Timing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('requestDetails.timing')}</Text>

          {/* Timing Type Selection */}
          <View style={styles.timingTypeContainer}>
            <TouchableOpacity
              style={[styles.timingTypeButton, timingType === 'flexible' && styles.selectedTimingType]}
              onPress={() => setTimingType('flexible')}
            >
              <Ionicons
                name="calendar"
                size={20}
                color={timingType === 'flexible' ? '#FFFFFF' : theme.textSecondary}
              />
              <Text
                style={[
                  styles.timingTypeText,
                  timingType === 'flexible' && styles.selectedTimingTypeText,
                ]}
              >
                {t('requestDetails.flexible')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timingTypeButton, timingType === 'urgent' && styles.selectedTimingType]}
              onPress={() => setTimingType('urgent')}
            >
              <Ionicons
                name="flash"
                size={20}
                color={timingType === 'urgent' ? '#FFFFFF' : theme.textSecondary}
              />
              <Text
                style={[
                  styles.timingTypeText,
                  timingType === 'urgent' && styles.selectedTimingTypeText,
                ]}
              >
                {t('requestDetails.urgent')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Flexible Timing Options */}
          {timingType === 'flexible' && (
            <View style={styles.flexibleOptions}>
              {/* Day Selection */}
              <Text style={styles.subLabel}>{t('requestDetails.selectDay')}</Text>
              <View style={styles.optionsGrid}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day.key}
                    style={[styles.optionButton, selectedDay === day.key && styles.selectedOption]}
                    onPress={() => setSelectedDay(day.key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedDay === day.key && styles.selectedOptionText,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Time Slot Selection */}
              <Text style={styles.subLabel}>{t('requestDetails.selectTime')}</Text>
              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.key}
                    style={[
                      styles.timeSlotCard,
                      selectedTimeSlot === slot.key && styles.selectedTimeSlotCard,
                    ]}
                    onPress={() => setSelectedTimeSlot(slot.key)}
                  >
                    <View style={styles.timeSlotIcon}>
                      <Ionicons
                        name={
                          slot.key === 'Morning'
                            ? 'sunny-outline'
                            : slot.key === 'Midday'
                            ? 'sunny'
                            : slot.key === 'Afternoon'
                            ? 'partly-sunny-outline'
                            : 'moon-outline'
                        }
                        size={28}
                        color={selectedTimeSlot === slot.key ? theme.primary : theme.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.timeSlotTitle,
                        selectedTimeSlot === slot.key && styles.selectedTimeSlotText,
                      ]}
                    >
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Informational Message */}
              <View style={styles.infoContainer}>
                <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                <Text style={styles.infoText}>{t('requestDetails.infoMessage')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{tCommon('next')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RequestDetails;
