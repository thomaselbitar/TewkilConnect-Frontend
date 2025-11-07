import React, { createContext, useContext, useReducer } from 'react';

const RequestContext = createContext();

const initialState = {
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

const requestReducer = (state, action) => {
  switch (action.type) {
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
    
    case 'RESET_REQUEST':
      return initialState;
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
};

export const RequestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);

  return (
    <RequestContext.Provider value={{ state, dispatch }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
}; 