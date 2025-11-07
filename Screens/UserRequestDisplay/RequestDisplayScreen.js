import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { GlobalStyles } from '../../constants/Styles'
import RequestUserScreen from './RequestUserScreen'
import WorkUserScreen from './WorkUserScreen'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from '../../hooks/useTranslation'

const Request = () => {
  const [isDisplay1, setIsDisplay1] = useState(true)
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { tRequestUser } = useTranslation()

  useEffect(() => {
    // Set up the header with switch button
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: {
        color: theme.textPrimary,
      },
      headerTitle: () => (
        <View style={styles.headerSwitchContainer}>
          <Text style={[styles.switchLabel, isDisplay1 && styles.activeLabel]}>{tRequestUser('yourRequest')}</Text>
          <Switch
            value={!isDisplay1}
            onValueChange={(value) => setIsDisplay1(!value)}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.background}
            style={styles.switch}
          />
          <Text style={[styles.switchLabel, !isDisplay1 && styles.activeLabel]}>{tRequestUser('yourWork')}</Text>
        </View>
      ),

    })
  }, [navigation, isDisplay1, theme, tRequestUser])

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {isDisplay1 ? (
        <RequestUserScreen navigation={navigation} />
      ) : (
        <WorkUserScreen />
      )}
    </View>
  )
}

export default Request

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textSecondary,
    marginHorizontal: 10,
  },
  activeLabel: {
    color: theme.textPrimary,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
})