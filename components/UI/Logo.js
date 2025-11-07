import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Logo = ({ size = 120, style }) => {
  const { isDarkMode } = useTheme();
  
  const logoSource = isDarkMode 
    ? require('../../assets/images/Logo/DarkLogo.png')
    : require('../../assets/images/Logo/LightLogo.png');

  return (
    <Image
      source={logoSource}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});

export default Logo;
