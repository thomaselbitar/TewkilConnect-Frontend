import React, { useMemo } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const AddContentModal = ({
  visible,
  onClose,
  onAddPost,
  onAddReel,
  position = 'center', // 'center', 'top', 'bottom', 'custom'
  customPosition = null, // { top, left } for custom positioning
}) => {
  const { theme } = useTheme();
  const { tModal } = useTranslation();

  const getModalPosition = () => {
    switch (position) {
      case 'top':
        return { justifyContent: 'flex-start', paddingTop: 100 };
      case 'bottom':
        return { justifyContent: 'flex-end', paddingBottom: 100 };
      case 'custom':
        return customPosition || {};
      default:
        return { justifyContent: 'center' };
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.25)',
          alignItems: 'center',
        },
        container: {
          backgroundColor: theme.cardBackground,
          borderRadius: 22,
          paddingVertical: 15,
          paddingHorizontal: 0,
          minWidth: 220,
          width: wp(60),
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        option: {
          paddingVertical: 12,
          width: '100%',
          alignItems: 'center',
        },
        optionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        icon: {
          marginRight: 10,
        },
        optionText: {
          fontSize: 20,
          color: theme.primary,
          textAlign: 'center',
          letterSpacing: 0.2,
          fontWeight: '600',
        },
        separator: {
          height: StyleSheet.hairlineWidth + 0.5,
          backgroundColor: theme.border,
          width: '70%',
          marginVertical: 5,
          alignSelf: 'center',
        },
      }),
    [theme]
  );

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.overlay, getModalPosition()]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onClose();
              onAddPost && onAddPost();
            }}
          >
            <View style={styles.optionRow}>
              <Ionicons name="create-outline" size={28} color={theme.primary} style={styles.icon} />
              <Text style={styles.optionText}>{tModal('addPost')}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onClose();
              onAddReel && onAddReel();
            }}
          >
            <View style={styles.optionRow}>
              <Ionicons name="videocam-outline" size={28} color={theme.primary} style={styles.icon} />
              <Text style={styles.optionText}>{tModal('addReel')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddContentModal;
