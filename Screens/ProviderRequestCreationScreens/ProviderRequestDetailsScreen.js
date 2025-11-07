import React from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequest } from '../RequestCreationScreens/RequestContext';
import { useRequestGroup } from '../RequestGroupCreationScreens/RequestGroupContext';
import RequestDetails from '../../components/RequestCreation/RequestDetails';
import { useTranslation } from '../../hooks/useTranslation';

const ProviderRequestDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { provider, requestType, selectedGroup } = route.params;
  const { tRequestCreation, tCommon } = useTranslation();

  // Use appropriate context based on request type
  const requestContext = useRequest();
  const requestGroupContext = useRequestGroup();
  
  const contextState = requestType === 'group' ? requestGroupContext.state : requestContext.state;
  const contextDispatch = requestType === 'group' ? requestGroupContext.dispatch : requestContext.dispatch;

  const handleNext = () => {
    navigation.replace('ProviderLocation', { 
      provider, 
      requestType,
      selectedGroup 
    });
  };

  const handleBack = () => {
    navigation.replace('ProviderCategorySelection', { 
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

  return (
    <RequestDetails
      contextState={contextState}
      contextDispatch={contextDispatch}
      onNext={handleNext}
      onBack={handleBack}
      onCancel={handleCancel}
    />
  );
};

export default ProviderRequestDetailsScreen;
