import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequest } from './RequestContext';
import Provider from '../../components/RequestCreation/Provider';
import { useTranslation } from '../../hooks/useTranslation';

const ProviderSelectionScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useRequest();
  const { tProviders, tRequestCreation } = useTranslation();

  const handleBack = () => {
    navigation.replace('BudgetScreen');
  };

  const handleNext = (providerData) => {
    navigation.replace('RequestReviewScreen');
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
            dispatch({ type: 'RESET' });
            navigation.replace('MainApp', { screen: 'Request' });
          }
        }
      ]
    );
  };

  return (
    <Provider
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onNext={handleNext}
      onCancel={handleCancel}
      headerTitle={tProviders('providerSelection')}
      description={tProviders('providerSelectionDescription')}
    />
  );
};

export default ProviderSelectionScreen; 