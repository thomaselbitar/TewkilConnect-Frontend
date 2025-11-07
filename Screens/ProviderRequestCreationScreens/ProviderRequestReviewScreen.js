import React from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequest } from '../RequestCreationScreens/RequestContext';
import { useRequestGroup } from '../RequestGroupCreationScreens/RequestGroupContext';
import Review from '../../components/RequestCreation/Review';
import { useTranslation } from '../../hooks/useTranslation';

const ProviderRequestReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { provider, requestType, selectedGroup } = route.params;
  const { tRequestCreation, tCommon } = useTranslation();

  // Use appropriate context based on request type
  const requestContext = useRequest();
  const requestGroupContext = useRequestGroup();
  
  const contextState = requestType === 'group' ? requestGroupContext.state : requestContext.state;
  const contextDispatch = requestType === 'group' ? requestGroupContext.dispatch : requestContext.dispatch;

  // Set the pre-selected provider in context
  React.useEffect(() => {
    if (contextDispatch) {
      contextDispatch({ 
        type: 'SET_PROVIDER_SELECTION', 
        payload: { 
          type: 'specific', 
          selectedProvider: provider 
        } 
      });
    }
  }, [provider, contextDispatch]);

  const handleBack = () => {
    navigation.replace('ProviderBudget', { 
      provider, 
      requestType,
      selectedGroup 
    });
  };

  const handleCancel = () => {
    Alert.alert(
      tRequestCreation('cancelRequest'),
      tRequestCreation('cancelConfirm'),
      [
        { text: tRequestCreation('keepEditing'), style: 'cancel' },
        { 
          text: tCommon('cancel'), 
          style: 'destructive',
          onPress: () => {
            if (contextDispatch) {
              contextDispatch({ type: 'RESET' });
            }
            navigation.replace('MainApp');
          }
        }
      ]
    );
  };

  const handleEdit = (screenName) => {
    // Navigate to the appropriate screen based on the section being edited
    switch (screenName) {
      case 'CategorySelection':
        navigation.replace('ProviderCategorySelection', { 
          provider, 
          requestType,
          selectedGroup 
        });
        break;
      case 'RequestFormDetails':
        navigation.replace('ProviderRequestDetails', { 
          provider, 
          requestType,
          selectedGroup 
        });
        break;
      case 'LocationScreen':
        navigation.replace('ProviderLocation', { 
          provider, 
          requestType,
          selectedGroup 
        });
        break;
      case 'BudgetScreen':
        navigation.replace('ProviderBudget', { 
          provider, 
          requestType,
          selectedGroup 
        });
        break;
      case 'ProviderSelectionScreen':
        // For provider-specific requests, we don't allow editing provider selection
        // since it's pre-selected from the provider profile
        break;
      default:
        console.log('Unknown screen:', screenName);
    }
  };

  const handlePublish = () => {
    // Handle request publishing
    console.log('Publishing provider request:', {
      contextState,
      provider,
      requestType,
      selectedGroup
    });
    
    // Here you would call your API to create the request
    // For now, just show success and navigate back
    navigation.navigate('MainApp', { screen: 'Request' });
  };

  return (
    <Review
      contextState={contextState}
      contextDispatch={contextDispatch}
      onBack={handleBack}
      onCancel={handleCancel}
      onPublish={handlePublish}
      onEdit={handleEdit}
      hideProviderEdit={true}
    />
  );
};

export default ProviderRequestReviewScreen;
