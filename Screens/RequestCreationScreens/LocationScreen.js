import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequest } from './RequestContext';
import Location from '../../components/RequestCreation/Location';
import { useTranslation } from '../../hooks/useTranslation';

const LocationScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useRequest();
  const { tRequestCreation } = useTranslation();

  const handleBack = () => {
    navigation.replace('RequestFormDetails');
  };

  const handleNext = (locationData) => {
    navigation.replace('BudgetScreen');
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
    <Location
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onNext={handleNext}
      onCancel={handleCancel}
      headerTitle={tRequestCreation('location')}
    />
  );
};

export default LocationScreen; 