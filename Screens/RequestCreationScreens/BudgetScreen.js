import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequest } from './RequestContext';
import Budget from '../../components/RequestCreation/Budget';
import { useTranslation } from '../../hooks/useTranslation';

const BudgetScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useRequest();
  const { tRequestCreation } = useTranslation();

  const handleBack = () => {
    navigation.replace('LocationScreen');
  };

  const handleNext = (budgetData) => {
    navigation.replace('ProviderSelectionScreen');
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
    <Budget
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onNext={handleNext}
      onCancel={handleCancel}
      headerTitle={tRequestCreation('budget')}
    />
  );
};

export default BudgetScreen; 