import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequest } from './RequestContext';
import Review from '../../components/RequestCreation/Review';
import { categories } from '../../Data/CategoryandTag';
import { useTranslation } from '../../hooks/useTranslation';

const RequestReviewScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useRequest();
  const [isPublishing, setIsPublishing] = useState(false);
  const { tRequestCreation } = useTranslation();

  // Helper function to check if category is custom
  const isCustomCategory = (category) => {
    return category && !categories.some(cat => cat.title === category);
  };

  const handleBack = () => {
    navigation.replace('ProviderSelectionScreen');
  };

  const handlePublish = async (requestData) => {
    try {
      // Here you would typically send the request to your backend
      console.log('Publishing request:', requestData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset the context
      dispatch({ type: 'RESET' });

      // Navigate back to home
      navigation.replace('MainApp');

      // Check if it's a custom category and show appropriate message
      const selectedCategory = state?.category || '';
      const isCustom = isCustomCategory(selectedCategory);
      
      if (isCustom) {
        Alert.alert(
          tRequestCreation('success'), 
          `${tRequestCreation('requestPublishedSuccess')}\n\n⚠️ ${tRequestCreation('customCategoryWarning').replace('{category}', selectedCategory)}`
        );
      } else {
        Alert.alert(tRequestCreation('success'), tRequestCreation('requestPublishedSuccess'));
      }
    } catch (error) {
      Alert.alert(tRequestCreation('error'), tRequestCreation('failedToPublishRequest'));
    }
  };

  const handleCancel = () => {
    Alert.alert(
      tRequestCreation('cancelRequest'),
      tRequestCreation('cancelConfirm'),
      [
        { text: tRequestCreation('keepEditing'), style: 'cancel' },
        {
          text: tRequestCreation('cancelRequestButton'),
          style: 'destructive',
          onPress: () => {
            // Reset the context
            dispatch({ type: 'RESET' });
            // Navigate back to MainApp with Request tab active
            navigation.replace('MainApp', { screen: 'Request' });
          },
        },
      ]
    );
  };

  const handleEdit = (screenName) => {
    navigation.replace(screenName);
  };

  return (
    <Review
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onEdit={handleEdit}
      headerTitle={tRequestCreation('review')}
      isPublishing={isPublishing}
      setIsPublishing={setIsPublishing}
    />
  );
};

export default RequestReviewScreen; 