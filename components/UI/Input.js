// components/UI/Input.jsx
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  InputAccessoryView,
  Keyboard,
  Button as RNButton,
  Pressable,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const Input = ({
  placeholder,
  keyboardType,
  styleCont,
  styleTxt,
  multiline,
  numberOfLines,
  onChangeText,
  onFocus,
  returnKeyType,
  secureBool,          // existing prop (backward compatible)
  isPassword = false,  // NEW: enables eye toggle
  disable = false,
  value,
  maxLength,
  showDoneAccessory,
  // pass-through extras if needed
  autoCapitalize = 'none',
  autoCorrect = false,
  textContentType,
  editable,           // optional override; if undefined we’ll derive from disable
  ...rest
}) => {
  const { theme, isDarkMode } = useTheme();
  const { tUI } = useTranslation();
  const inputAccessoryViewID = 'uniqueID';

  // Local visibility toggle ONLY when isPassword is true.
  const [show, setShow] = useState(false);

  // Effective secure flag:
  // - If caller passes secureBool explicitly, we respect it (legacy behavior).
  // - Else if password mode, we compute from our local toggle.
  // - Else not secure.
  const effectiveSecure =
    typeof secureBool === 'boolean' ? secureBool : isPassword ? !show : false;

  // Some RN builds only update dot/plaintext after remounting:
  const inputKey = effectiveSecure ? 'secure-on' : 'secure-off';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
          borderWidth: 1,
          borderRadius: 10,
          width: '100%',
          paddingHorizontal: Platform.OS === 'ios' ? wp(4) : wp(2.5),
          paddingVertical: Platform.OS === 'ios' ? hp(1.8) : hp(0.8),
        },
        wrap: {
          position: 'relative',
        },
        text: {
          fontSize: 15,
          fontWeight: '400',
          color: theme.textPrimary,
        },
        textWithIcon: {
          paddingRight: 44, // space for eye
        },
        eyeButton: {
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: [{ translateY: -16 }],
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
        },
        accessoryBar: {
          backgroundColor: theme.surfaceLight,
          padding: 8,
          alignItems: 'flex-end',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.border,
        },
      }),
    [theme, isDarkMode]
  );

  const resolvedEditable = typeof editable === 'boolean' ? editable : !disable;

  // Hint iOS autofill to avoid odd behavior when showing/hiding
  const resolvedTextContentType =
    textContentType ??
    (isPassword ? (effectiveSecure ? 'password' : 'none') : 'none');

  return (
    <View style={[styles.container, styleCont]}>
      <View style={styles.wrap}>
        <TextInput
          key={inputKey}
          style={[
            styles.text,
            isPassword && styles.textWithIcon,
            styleTxt,
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor={theme.textSecondary}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onFocus={onFocus}
          returnKeyType={returnKeyType}
          secureTextEntry={effectiveSecure}
          editable={resolvedEditable}
          value={value}
          maxLength={maxLength}
          selectionColor={theme.primary}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={resolvedTextContentType}
          importantForAutofill={isPassword ? 'no' : 'auto'}
          autoComplete={isPassword ? 'off' : 'on'}
          {...(showDoneAccessory && Platform.OS === 'ios' ? { inputAccessoryViewID } : {})}
          {...(Platform.OS === 'ios' ? { keyboardAppearance: isDarkMode ? 'dark' : 'light' } : {})}
          {...rest}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShow((v) => !v)}
            style={styles.eyeButton}
            hitSlop={8}
          >
            <Feather
              name={show ? 'eye' : 'eye-off'}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {showDoneAccessory && Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessoryBar}>
            <RNButton onPress={Keyboard.dismiss} title={tUI('done')} color={theme.primary} />
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
};

export default Input;
