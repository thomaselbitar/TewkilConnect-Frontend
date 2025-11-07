import React, { createContext, useContext, useReducer } from 'react';

const RequestGroupContext = createContext();

const initialState = {
  groupId: '', // ID of the group this request belongs to
  category: '',
  title: '',
  description: '',
  timing: {
    type: 'urgent', // 'urgent' or 'flexible'
    day: '',
    timeSlot: ''
  },
  location: {
    city: '',
    street: '',
    building: '',
    images: []
  },
  budget: {
    hasBudget: false,
    type: 'none', // 'none', 'fixed', 'hourly', 'professional'
    amount: 0,
    hourlyRate: 0
  },
  providerSelection: {
    type: 'all', // 'all' or 'specific'
    selectedProvider: null
  }
};

const requestGroupReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GROUP_ID':
      return { ...state, groupId: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    
    case 'SET_TIMING_TYPE':
      return { 
        ...state, 
        timing: { 
          ...state.timing, 
          type: action.payload,
          day: action.payload === 'urgent' ? '' : state.timing.day,
          timeSlot: action.payload === 'urgent' ? '' : state.timing.timeSlot
        } 
      };
    
    case 'SET_TIMING_DAY':
      return { 
        ...state, 
        timing: { ...state.timing, day: action.payload } 
      };
    
    case 'SET_TIMING_SLOT':
      return { 
        ...state, 
        timing: { ...state.timing, timeSlot: action.payload } 
      };
    
    case 'SET_LOCATION':
      return { 
        ...state, 
        location: { ...state.location, ...action.payload } 
      };
    
    case 'SET_BUDGET':
      return { 
        ...state, 
        budget: { ...state.budget, ...action.payload } 
      };
    
    case 'SET_PROVIDER_SELECTION':
      return { 
        ...state, 
        providerSelection: { ...state.providerSelection, ...action.payload } 
      };
    
    case 'RESET_REQUEST_GROUP':
      return initialState;
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
};

export const RequestGroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(requestGroupReducer, initialState);

  return (
    <RequestGroupContext.Provider value={{ state, dispatch }}>
      {children}
    </RequestGroupContext.Provider>
  );
};

export const useRequestGroup = () => {
  const context = useContext(RequestGroupContext);
  if (!context) {
    throw new Error('useRequestGroup must be used within a RequestGroupProvider');
  }
  return context;
}; 