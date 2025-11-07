import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequest } from '../RequestCreationScreens/RequestContext';
import { useRequestGroup } from '../RequestGroupCreationScreens/RequestGroupContext';
import ProviderCategorySelection from '../../components/RequestCreation/ProviderCategorySelection';

const ProviderCategorySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { provider, requestType, selectedGroup } = route.params;

  // Use appropriate context based on request type
  const requestContext = useRequest();
  const requestGroupContext = useRequestGroup();
  
  const contextState = requestType === 'group' ? requestGroupContext.state : requestContext.state;
  const contextDispatch = requestType === 'group' ? requestGroupContext.dispatch : requestContext.dispatch;

  // Set group ID if it's a group request
  React.useEffect(() => {
    if (requestType === 'group' && selectedGroup && contextDispatch) {
      contextDispatch({ type: 'SET_GROUP_ID', payload: selectedGroup.id });
    }
  }, [requestType, selectedGroup, contextDispatch]);

  const handleNext = (category) => {
    navigation.replace('ProviderRequestDetails', { 
      provider, 
      requestType,
      selectedGroup 
    });
  };

  const handleBack = () => {
    navigation.replace('ProviderRequestType', { provider });
  };

  const handleCancel = () => {
    // Reset context and go back to home
    if (contextDispatch) {
      contextDispatch({ type: 'RESET' });
    }
    navigation.replace('MainApp');
  };

  return (
    <ProviderCategorySelection
      onNext={handleNext}
      onBack={handleBack}
      onCancel={handleCancel}
      selectedProvider={provider}
      contextState={contextState}
      contextDispatch={contextDispatch}
    />
  );
};

export default ProviderCategorySelectionScreen;
