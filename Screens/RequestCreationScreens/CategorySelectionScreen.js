import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequest } from './RequestContext';
import CategorySelection from '../../components/RequestCreation/CategorySelection';

const CategorySelectionScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useRequest();

  const handleBackOrCancel = () => {
    // Always reset context for safety and navigate back
    // The component will handle showing alerts if needed
    dispatch({ type: 'RESET' });
    navigation.replace('MainApp', { screen: 'Request' });
  };


  const handleNext = (category) => {
    navigation.replace('RequestFormDetails');
  };



  return (
    <CategorySelection
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBackOrCancel}
      onNext={handleNext}
      onCancel={handleBackOrCancel}

    />
  );
};

export default CategorySelectionScreen; 