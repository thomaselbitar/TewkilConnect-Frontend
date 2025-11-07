import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wp, hp } from '../../utils/helpers';
import Button from '../../components/UI/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const EditGroupWorkScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { tGroupWork } = useTranslation();

  const { groupWork } = route.params || {};

  const [title, setTitle] = useState(groupWork?.title || '');
  const [description, setDescription] = useState(groupWork?.description || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateGroupWork = useCallback(() => {
    if (!title.trim()) {
      Alert.alert(tGroupWork('alerts.error'), tGroupWork('errors.enterTitle'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(tGroupWork('alerts.error'), tGroupWork('errors.enterDescription'));
      return;
    }

    setIsUpdating(true);

    setTimeout(() => {
      const updatedGroupWork = {
        ...groupWork,
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Updated Group Work:', updatedGroupWork);

      Alert.alert(tGroupWork('alerts.success'), tGroupWork('success.updated'), [
        {
          text: tGroupWork('alerts.ok'),
          onPress: () => navigation.replace('GroupWorkDetails', { groupWork: updatedGroupWork }),
        },
      ]);
      setIsUpdating(false);
    }, 2000);
  }, [title, description, groupWork, navigation]);

  const handleCancel = useCallback(() => {
    const hasChanges = title !== groupWork?.title || description !== groupWork?.description;

    if (hasChanges) {
      Alert.alert(tGroupWork('alerts.discardChanges'), tGroupWork('alerts.discardConfirm'), [
        { text: tGroupWork('cancel'), style: 'cancel' },
        {
          text: tGroupWork('alerts.discard'),
          style: 'destructive',
          onPress: () => navigation.replace('GroupWorkDetails', { groupWork }),
        },
      ]);
    } else {
      navigation.replace('GroupWorkDetails', { groupWork });
    }
  }, [title, description, groupWork, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: tGroupWork('editGroupWork'),
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: theme.background },
      headerTitleStyle: { color: theme.textPrimary },
      headerTintColor: theme.textPrimary,
      headerLeft: () => (
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      gestureEnabled: !(title.trim() || description.trim()),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleUpdateGroupWork}
          style={[styles.headerButton, { opacity: !title.trim() || !description.trim() || isUpdating ? 0.5 : 1 }]}
        >
          <Text
            style={[
              styles.updateHeaderButton,
              { color: !title.trim() || !description.trim() ? theme.disabled : theme.primary },
            ]}
          >
            {isUpdating ? tGroupWork('updating') : tGroupWork('update')}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, description, isUpdating, handleCancel, handleUpdateGroupWork, theme, tGroupWork]);

  if (!groupWork) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{tGroupWork('noDataFound')}</Text>
      </View>
    );
  }

  const isDisabled = !title.trim() || !description.trim() || isUpdating;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{tGroupWork('editGroupWork')}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {tGroupWork('editSubtitle')}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.primary }]}>{tGroupWork('title')} *</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder={tGroupWork('placeholders.title')}
              placeholderTextColor={theme.textSecondary}
              maxLength={30}
            />
            <Text style={[styles.characterCount, { color: theme.textSecondary }]}>{title.length}/30</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.primary }]}>{tGroupWork('description')} *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder={tGroupWork('placeholders.description')}
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.characterCount, { color: theme.textSecondary }]}>{description.length}/500</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleCancel}
            styleButton={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.background,
            }}
            styleText={{ fontSize: 16, color: theme.textSecondary, fontWeight: '600' }}
          >
            {tGroupWork('cancel')}
          </Button>

          <Button
            onPress={handleUpdateGroupWork}
            styleButton={{
              flex: 2,
              backgroundColor: isDisabled ? theme.disabled : theme.primary,
            }}
            styleText={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}
          >
            <View style={styles.updateButtonContent}>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold', marginLeft: 8 }}>
                {isUpdating ? tGroupWork('updating') : tGroupWork('editGroupWork')}
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, lineHeight: 20 },
  formContainer: { flex: 1 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 200, textAlignVertical: 'top' },
  characterCount: { fontSize: 12, textAlign: 'right', marginTop: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12, marginBottom: 15 },
  updateButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerButton: { paddingHorizontal: 16, paddingVertical: 8 },
  updateHeaderButton: { fontSize: 16, fontWeight: '600', minWidth: 80, textAlign: 'center', height: 20, lineHeight: 20 },
  errorText: { fontSize: 16, textAlign: 'center', marginTop: 50 },
});

export default EditGroupWorkScreen;
