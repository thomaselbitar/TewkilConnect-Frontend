import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import { userGroupWorks } from '../../Data/UserData';

const RequestTypeSelection = ({
  onNext,
  onBack,
  onCancel,
  selectedProvider,
  headerTitle,
  description,
}) => {
  const { theme } = useTheme();
  const { tRequest, tCommon } = useTranslation();
  
  const [requestType, setRequestType] = useState('single'); // 'single' or 'group'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Load user's group works
    setGroups(userGroupWorks);
  }, []);

  const handleRequestTypeSelect = (type) => {
    setRequestType(type);
    // Reset group selection when switching to single request
    if (type === 'single') {
      setSelectedGroup(null);
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleNext = () => {
    if (!requestType) {
      Alert.alert(tCommon('error'), tRequest('selectRequestType'));
      return;
    }
    
    // If group request is selected, validate that a group is also selected
    if (requestType === 'group' && !selectedGroup) {
      Alert.alert(tCommon('error'), tRequest('selectGroupWork'));
      return;
    }
    
    onNext(requestType, selectedGroup);
  };

  const handleBackOrCancel = () => {
    if (requestType) {
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
    } else {
      if (onCancel) onCancel();
    }
  };

  const isNextDisabled = !requestType || (requestType === 'group' && !selectedGroup);

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
          lineHeight: 20,
        },
        selectedOptionDescription: {
          color: '#FFFFFF',
        },
        groupSection: {
          marginTop: 20,
        },
        groupSelectionMessage: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textPrimary,
          marginBottom: 15,
          textAlign: 'left',
        },
        groupCard: {
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: 12,
          padding: 15,
          marginBottom: 10,
          backgroundColor: theme.surfaceLight,
        },
        selectedGroupCard: {
          borderColor: theme.primary,
          backgroundColor: theme.primary,
        },
        groupContent: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        groupInfo: {
          flex: 1,
        },
        groupTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textPrimary,
          marginBottom: 4,
        },
        selectedGroupTitle: {
          color: '#FFFFFF',
        },
        groupDescription: {
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 8,
        },
        selectedGroupDescription: {
          color: '#FFFFFF',
        },
        groupMeta: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        groupMetaText: {
          fontSize: 12,
          color: theme.textSecondary,
          marginRight: 8,
        },
        selectedGroupMetaText: {
          color: '#FFFFFF',
        },
        emptyState: {
          alignItems: 'center',
          paddingVertical: 40,
        },
        emptyTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 16,
          marginBottom: 8,
          color: theme.textPrimary,
        },
        emptyDescription: {
          fontSize: 14,
          color: theme.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
          paddingHorizontal: 20,
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
          <TouchableOpacity onPress={handleBackOrCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle || tRequest('createRequest')}</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Provider Info */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>
            {tRequest('requestingFrom')} {selectedProvider?.name}
          </Text>
        </View>

        <Text style={styles.description}>
          {description || tRequest('chooseRequestTypeDescription')}
        </Text>

        {/* Request Type Selection */}
        <View style={styles.optionsContainer}>
          {/* Single Request Option */}
          <TouchableOpacity
            style={[styles.optionCard, requestType === 'single' && styles.selectedOptionCard]}
            onPress={() => handleRequestTypeSelect('single')}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="person-outline"
                size={24}
                color={requestType === 'single' ? '#FFFFFF' : theme.primary}
              />
              <Text style={[styles.optionTitle, requestType === 'single' && styles.selectedOptionText]}>
                {tRequest('singleRequest')}
              </Text>
            </View>
            <Text style={[styles.optionDescription, requestType === 'single' && styles.selectedOptionDescription]}>
              {tRequest('singleRequestDescription')}
            </Text>
          </TouchableOpacity>

          {/* Group Request Option */}
          <TouchableOpacity
            style={[styles.optionCard, requestType === 'group' && styles.selectedOptionCard]}
            onPress={() => handleRequestTypeSelect('group')}
          >
            <View style={styles.optionHeader}>
              <Ionicons
                name="people-outline"
                size={24}
                color={requestType === 'group' ? '#FFFFFF' : theme.primary}
              />
              <Text style={[styles.optionTitle, requestType === 'group' && styles.selectedOptionText]}>
                {tRequest('groupRequest')}
              </Text>
            </View>
            <Text style={[styles.optionDescription, requestType === 'group' && styles.selectedOptionDescription]}>
              {tRequest('groupRequestDescription')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Group Selection - Only show when group request is selected */}
        {requestType === 'group' && (
          <View style={styles.groupSection}>
            {/* Group Selection Message */}
            <Text style={styles.groupSelectionMessage}>
              {tRequest('pleaseSelectGroup')}
            </Text>
            
            {groups.length > 0 ? (
              groups.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.groupCard,
                    selectedGroup?.id === item.id && styles.selectedGroupCard
                  ]}
                  onPress={() => handleGroupSelect(item)}
                >
                  <View style={styles.groupContent}>
                    <View style={styles.groupInfo}>
                      <Text style={[
                        styles.groupTitle,
                        selectedGroup?.id === item.id && styles.selectedGroupTitle
                      ]}>
                        {item.title}
                      </Text>
                      <Text style={[
                        styles.groupDescription,
                        selectedGroup?.id === item.id && styles.selectedGroupDescription
                      ]}>
                        {item.description}
                      </Text>
                      <View style={styles.groupMeta}>
                        <Text style={[
                          styles.groupMetaText,
                          selectedGroup?.id === item.id && styles.selectedGroupMetaText
                        ]}>
                          {item.requests?.length || 0} {tRequest('requests')}
                        </Text>
                        <Text style={[
                          styles.groupMetaText,
                          selectedGroup?.id === item.id && styles.selectedGroupMetaText
                        ]}>
                          • {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={selectedGroup?.id === item.id ? 'radio-button-on' : 'radio-button-off'}
                      size={24}
                      color={selectedGroup?.id === item.id ? '#FFFFFF' : theme.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="folder-outline" size={64} color={theme.textSecondary} />
                <Text style={styles.emptyTitle}>{tRequest('noGroupWorks')}</Text>
                <Text style={styles.emptyDescription}>
                  {tRequest('noGroupWorksDescription')}
                </Text>
              </View>
            )}
          </View>
        )}

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

export default RequestTypeSelection;
