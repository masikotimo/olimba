import { Platform } from 'react-native';

export const Config = {
  isAndroid: Platform.OS === 'android',
  isIos: Platform.OS === 'ios',
  isWeb: Platform.OS === 'web',
  isWindows: Platform.OS === 'windows',
  isMobile: Platform.OS === 'android' || Platform.OS === 'ios',
  isDesktop: Platform.OS === 'macos' || Platform.OS === 'windows',
};
