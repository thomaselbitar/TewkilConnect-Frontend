import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequest } from './RequestContext';
import RequestDetails from '../../components/RequestCreation/RequestDetails';
import { useTranslation } from '../../hooks/useTranslation';

const RequestFormDetailsScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useRequest();
  const { tRequestCreation } = useTranslation();

  const handleBack = () => {
    navigation.replace('CategorySelection');
  };

  const handleNext = (formData) => {
    navigation.replace('LocationScreen');
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
    <RequestDetails
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onNext={handleNext}
      onCancel={handleCancel}
      headerTitle={tRequestCreation('requestDetails')}
    />
  );
};

export default RequestFormDetailsScreen; 