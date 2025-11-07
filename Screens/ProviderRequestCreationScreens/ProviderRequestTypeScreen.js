import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import RequestTypeSelection from '../../components/RequestCreation/RequestTypeSelection';

const ProviderRequestTypeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { provider } = route.params;

  const handleNext = (requestType, selectedGroup) => {
    // Go directly to category selection with both single and group requests
    navigation.replace('ProviderCategorySelection', { 
      provider, 
      requestType,
      selectedGroup 
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <RequestTypeSelection
      onNext={handleNext}
      onBack={handleBack}
      onCancel={handleCancel}
      selectedProvider={provider}
    />
  );
};

export default ProviderRequestTypeScreen;
