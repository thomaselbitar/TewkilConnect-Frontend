import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequestGroup } from './RequestGroupContext';
import Review from '../../components/RequestCreation/Review';
import { categories } from '../../Data/CategoryandTag';
import { useTranslation } from '../../hooks/useTranslation';

const GroupRequestReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params || {};
  const { state, dispatch } = useRequestGroup();
  const [isPublishing, setIsPublishing] = useState(false);
  const { tRequestCreation } = useTranslation();

  // Helper function to check if category is custom
  const isCustomCategory = (category) => {
    return category && !categories.some(cat => cat.title === category);
  };

  // Set the group ID when component mounts (if not already set)
  useEffect(() => {
    if (groupId && !state.groupId) {
      dispatch({ type: 'SET_GROUP_ID', payload: groupId });
    }
  }, [groupId, state.groupId, dispatch]);

  const handleBack = () => {
    // Navigate back to the group provider selection screen
    navigation.replace('GroupProviderSelection', { groupId });
  };

  const handlePublish = async (requestData) => {
    try {
      // Here you would typically send the group request to your backend
      console.log('Publishing group request:', requestData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset the context
      dispatch({ type: 'RESET' });

      // Navigate back to group work details
      navigation.replace('GroupWorkDetails', { groupWork: { id: groupId } });

      // Check if it's a custom category and show appropriate message
      const selectedCategory = state?.category || '';
      const isCustom = isCustomCategory(selectedCategory);
      
      if (isCustom) {
        Alert.alert(
          tRequestCreation('success'), 
          `${tRequestCreation('groupRequestPublishedSuccess')}\n\n⚠️ ${tRequestCreation('groupCustomCategoryWarning').replace('{category}', selectedCategory)}`
        );
      } else {
        Alert.alert(tRequestCreation('success'), tRequestCreation('groupRequestPublishedSuccess'));
      }
    } catch (error) {
      Alert.alert(tRequestCreation('error'), tRequestCreation('failedToPublishGroupRequest'));
    }
  };

  const handleCancel = () => {
    Alert.alert(
      tRequestCreation('cancelGroupRequest'),
      tRequestCreation('cancelGroupConfirm'),
      [
        { text: tRequestCreation('keepEditing'), style: 'cancel' },
        {
          text: tRequestCreation('cancelRequestButton'),
          style: 'destructive',
          onPress: () => {
            // Reset the context
            dispatch({ type: 'RESET' });
            // Navigate back to group work details
            navigation.replace('GroupWorkDetails', { groupWork: { id: groupId } });
          },
        },
      ]
    );
  };

  const handleEdit = (screenName) => {
    // Map regular screen names to group screen names
    const screenMapping = {
      'CategorySelection': 'GroupCategorySelection',
      'RequestFormDetails': 'GroupRequestDetails',
      'LocationScreen': 'GroupLocation',
      'BudgetScreen': 'GroupBudget',
      'ProviderSelectionScreen': 'GroupProviderSelection',
    };

    const groupScreenName = screenMapping[screenName] || screenName;
    
    if (groupScreenName.startsWith('Group')) {
      navigation.replace(groupScreenName, { groupId });
    } else {
      navigation.replace(groupScreenName);
    }
  };

  return (
    <Review
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onEdit={handleEdit}
      isPublishing={isPublishing}
      setIsPublishing={setIsPublishing}
      showGroupInfo={true}
      groupId={groupId}
    />
  );
};

export default GroupRequestReviewScreen; 