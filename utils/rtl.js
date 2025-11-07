import { I18nManager } from 'react-native';
import i18n from '../i18n';

export const isRTL = () => {
  return i18n.language === 'ar';
};

export const getTextAlign = () => {
  return isRTL() ? 'right' : 'left';
};

export const getFlexDirection = () => {
  return isRTL() ? 'row-reverse' : 'row';
};

export const getMarginStart = (value) => {
  return isRTL() ? { marginEnd: value } : { marginStart: value };
};

export const getMarginEnd = (value) => {
  return isRTL() ? { marginStart: value } : { marginEnd: value };
};

export const getPaddingStart = (value) => {
  return isRTL() ? { paddingEnd: value } : { paddingStart: value };
};

export const getPaddingEnd = (value) => {
  return isRTL() ? { paddingStart: value } : { paddingEnd: value };
};

export const forceRTL = (isRTL) => {
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

export const updateRTL = (language) => {
  const shouldBeRTL = language === 'ar';
  if (I18nManager.isRTL !== shouldBeRTL) {
    forceRTL(shouldBeRTL);
    // Note: You might need to restart the app for RTL changes to take effect
    console.log('RTL setting changed. Please restart the app for changes to take effect.');
  }
};

