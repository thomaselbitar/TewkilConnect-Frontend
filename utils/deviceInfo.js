import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = !isIOS;

export function getDeviceName() {
  return Device.modelName;
}
