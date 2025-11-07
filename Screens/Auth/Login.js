// screens/auth/Login.jsx  (adjust the path to your project structure)
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";

import {
  validateLebanesePhone,
  validatePasswordStrength,
} from "../../constants/validation";
import { getErrorMessages } from "../../constants/errorMessages";

import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Logo from "../../components/UI/Logo";

import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../hooks/useTranslation";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* -------------------- HOISTED, STABLE COMPONENTS -------------------- */
const BackButton = ({ onPress, styles, color }) => (
  <TouchableOpacity onPress={onPress} style={styles.backButton}>
    <Feather name="arrow-left" size={24} color={color} />
  </TouchableOpacity>
);

const StepIndicator = ({ currentStep, styles }) => {
  const steps = ["login", "forgot", "verify", "reset"];
  const currentIndex = steps.indexOf(currentStep);
  return (
    <View style={styles.stepIndicator}>
      {steps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            index <= currentIndex && styles.stepDotActive,
          ]}
        />
      ))}
    </View>
  );
};
/* -------------------------------------------------------------------- */

const Login = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { tAuth, tErrors } = useTranslation();
  const errorMessages = getErrorMessages(tErrors);

  // Form state
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // UI state
  const [currentStep, setCurrentStep] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard visibility (to tune padding & scroll)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  useEffect(() => {
    const s = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const h = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  // Mock constants
  const VALID_PASSWORD = "123456";
  const VALID_CODE = "1234";

  // Bottom padding: smaller when keyboard is open
  const bottomPad = isKeyboardVisible ? 24 : 120;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },
        keyboardView: {
          flex: 1,
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: bottomPad,
        },
        mainContent: {
          flex: 1,
          justifyContent: "center",
          minHeight: SCREEN_HEIGHT * 0.7,
        },
        header: {
          alignItems: "center",
          marginBottom: 48,
        },
        logo: {
          marginBottom: 0,
        },
        title: {
          fontSize: 22,
          fontWeight: "700",
          textAlign: "center",
          color: "#007BFF",
          fontFamily: "Ubuntu_700Bold",
          marginBottom: 8,
          letterSpacing: 0.5,
        },
        subtitle: {
          marginTop:5,
          fontSize: 18,
          fontWeight: "500",
          textAlign: "center",
          color: theme.textSecondary,
          lineHeight: 24,
        },
        form: {
          width: "100%",
        },
        inputWrapper: {
          marginBottom: 24,
        },
        errorText: {
          color: theme.error,
          fontSize: 13,
          marginTop: 8,
          marginLeft: 4,
          fontWeight: "500",
        },
        buttonWrapper: {
          marginTop: 20,
        },
        linkWrapper: {
          alignItems: "center",
          marginTop: 24,
        },
        oneLineText: {
          textAlign: "center",
          color: theme.textSecondary,
          fontSize: 15,
        },
        link: {
          color: theme.primary,
          fontSize: 15,
          fontWeight: "600",
          textDecorationLine: "underline",
        },
        backButton: {
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: theme.cardBackground,
          borderRadius: 25,
          width: 50,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        togglesContainer: {
         
          position: "absolute",
          bottom: isKeyboardVisible ? 8 : 32,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          zIndex: 1000,
          pointerEvents: "box-none",
        },
        togglesRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between", // push to left & right
          paddingHorizontal: 0,           // margin from screen edges
        },
        toggleButton: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: theme.cardBackground,
          borderWidth: 1,
          borderColor: theme.border,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        },
        toggleText: {
          fontSize: 22,
        },
        disabledInput: {
          backgroundColor: theme.cardBackground,
          opacity: 0.7,
        },
        stepIndicator: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 32,
          gap: 8,
        },
        stepDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.border,
        },
        stepDotActive: {
          backgroundColor: theme.primary,
          width: 24,
        },
      }),
    [theme, bottomPad, isKeyboardVisible]
  );

  // Helpers
  const clearAllErrors = useCallback(() => {
    setErrors({
      phone: "",
      password: "",
      confirmPassword: "",
      verificationCode: "",
    });
  }, []);

  const goToStep = useCallback(
    (step) => {
      clearAllErrors();
      setCurrentStep(step);
    },
    [clearAllErrors]
  );

  // Validation
  const validatePhone = useCallback(() => {
    if (!formData.phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: errorMessages.PHONE_REQUIRED }));
      return false;
    }
    if (!validateLebanesePhone(formData.phone)) {
      setErrors((prev) => ({ ...prev, phone: errorMessages.PHONE_INVALID }));
      return false;
    }
    return true;
  }, [formData.phone, errorMessages]);

  const validatePassword = useCallback(() => {
    if (!formData.password.trim()) {
      setErrors((prev) => ({ ...prev, password: errorMessages.PASSWORD_REQUIRED }));
      return false;
    }
    if (currentStep === "login" && formData.password !== VALID_PASSWORD) {
      setErrors((prev) => ({ ...prev, password: errorMessages.PASSWORD_INCORRECT }));
      return false;
    }
    if (currentStep === "reset" && !validatePasswordStrength(formData.password)) {
      setErrors((prev) => ({ ...prev, password: errorMessages.PASSWORD_WEAK }));
      return false;
    }
    return true;
  }, [formData.password, currentStep, errorMessages]);

  const validateConfirmPassword = useCallback(() => {
    if (!formData.confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: errorMessages.CONFIRM_PASSWORD_REQUIRED,
      }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: errorMessages.PASSWORDS_NOT_MATCHING,
      }));
      return false;
    }
    return true;
  }, [formData.password, formData.confirmPassword, errorMessages]);

  const validateVerificationCode = useCallback(() => {
    if (!formData.verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: errorMessages.VERIFICATION_REQUIRED,
      }));
      return false;
    }
    if (formData.verificationCode !== VALID_CODE) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: errorMessages.VERIFICATION_INCORRECT,
      }));
      return false;
    }
    return true;
  }, [formData.verificationCode, errorMessages]);

  // Actions
  const handleLogin = useCallback(async () => {
    if (!validatePhone() || !validatePassword()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    setTimeout(() => {
      setIsLoading(false);
      navigation.replace("MainApp");
    }, 800);
  }, [validatePhone, validatePassword, navigation]);

  const handleForgotPassword = useCallback(() => {
    goToStep("forgot");
  }, [goToStep]);

  const handleSendVerificationCode = useCallback(async () => {
    if (!validatePhone()) return;

    Keyboard.dismiss();
    Alert.alert(
      tAuth("alerts.confirmNumber"),
      `${tAuth("alerts.isThisYourNumber")}\n+961 ${formData.phone}`,
      [
        { text: tAuth("alerts.change"), style: "cancel" },
        {
          text: tAuth("alerts.yes"),
          onPress: () => goToStep("verify"),
        },
      ]
    );
  }, [formData.phone, validatePhone, tAuth, goToStep]);

  const handleVerifyCode = useCallback(async () => {
    if (!validateVerificationCode()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    setTimeout(() => {
      setIsLoading(false);
      goToStep("reset");
    }, 800);
  }, [validateVerificationCode, goToStep]);

  const handleResetPassword = useCallback(async () => {
    if (!validatePassword() || !validateConfirmPassword()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        tAuth("alerts.success"),
        tAuth("alerts.passwordChangedSuccessfully"),
        [
          {
            text: tAuth("alerts.ok"),
            onPress: () => navigation.replace("MainApp"),
          },
        ],
        { cancelable: false }
      );
    }, 800);
  }, [validatePassword, validateConfirmPassword, tAuth, navigation]);

  const handleSignUp = useCallback(() => {
    navigation.replace("SignUp");
  }, [navigation]);

  const handleCancel = useCallback(() => {
    if (currentStep === "forgot") {
      goToStep("login");
    } else {
      Alert.alert(
        tAuth("alerts.areYouSure"),
        tAuth("alerts.doYouWantToCancel"),
        [
          { text: tAuth("alerts.no"), style: "cancel" },
          { text: tAuth("alerts.yes"), onPress: () => goToStep("login") },
        ]
      );
    }
  }, [currentStep, tAuth, goToStep]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={isKeyboardVisible} // no scroll when keyboard closed
        >
          {/* LOGIN STEP */}
          {currentStep === "login" && (
            <View style={styles.mainContent}>
              <View style={styles.header}>
                <Logo size={280} style={styles.logo} />
                <Text style={styles.title}>{tAuth("welcome")}</Text>
                <Text style={styles.subtitle}>{tAuth("login")}</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("phoneNumber")}
                    keyboardType="number-pad"
                    value={formData.phone}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, phone: text }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    maxLength={8}
                    autoCapitalize="none"
                  />
                  {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("password")}
                    value={formData.password}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, password: text }));
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    isPassword           // << built-in eye toggle
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>

                <View style={styles.buttonWrapper}>
                  <Button onPress={handleLogin} disabled={isLoading}>
                    <Text>{isLoading ? "Signing in..." : tAuth("loginButton")}</Text>
                  </Button>
                </View>

                <View style={styles.linkWrapper}>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.link}>{tAuth("forgotPassword")}</Text>
                  </TouchableOpacity>
                </View>

                {/* one-line, centered sentence */}
                <View style={styles.linkWrapper}>
                  <Text style={styles.oneLineText}>
                    {tAuth("noAccount")}{" "}
                    <Text style={styles.link} onPress={handleSignUp}>
                      {tAuth("signup")}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* FORGOT STEP */}
          {currentStep === "forgot" && (
            <View style={styles.mainContent}>
              <BackButton onPress={handleCancel} styles={styles} color={theme.textPrimary} />
              <StepIndicator currentStep={currentStep} styles={styles} />

              <View style={styles.header}>
                <Logo size={220} style={styles.logo} />
                <Text style={styles.title}>{tAuth("welcome")}</Text>
                <Text style={styles.subtitle}>{tAuth("phoneNumber")}</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("phoneNumber")}
                    keyboardType="number-pad"
                    value={formData.phone}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, phone: text }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    maxLength={8}
                    autoCapitalize="none"
                  />
                  {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                </View>

                <View style={styles.buttonWrapper}>
                  <Button onPress={handleSendVerificationCode} disabled={isLoading}>
                    <Text>{isLoading ? "Sending..." : tAuth("sendVerificationCode")}</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}

          {/* VERIFY STEP */}
          {currentStep === "verify" && (
            <View style={styles.mainContent}>
              <BackButton onPress={handleCancel} styles={styles} color={theme.textPrimary} />
              <StepIndicator currentStep={currentStep} styles={styles} />

              <View style={styles.header}>
                <Logo size={220} style={styles.logo} />
                <Text style={styles.title}>{tAuth("welcome")}</Text>
                <Text style={styles.subtitle}>
                  {tAuth("enterVerificationCode")} {formData.phone}
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("verificationCodePlaceholder")}
                    keyboardType="numeric"
                    value={formData.verificationCode}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, verificationCode: text }));
                      if (errors.verificationCode) setErrors((prev) => ({ ...prev, verificationCode: "" }));
                    }}
                    maxLength={4}
                    autoCapitalize="none"
                  />
                  {errors.verificationCode ? <Text style={styles.errorText}>{errors.verificationCode}</Text> : null}
                </View>

                <View style={styles.buttonWrapper}>
                  <Button onPress={handleVerifyCode} disabled={isLoading}>
                    <Text>{isLoading ? "Verifying..." : tAuth("verify")}</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}

          {/* RESET STEP */}
          {currentStep === "reset" && (
            <View style={styles.mainContent}>
              <BackButton onPress={handleCancel} styles={styles} color={theme.textPrimary} />
              <StepIndicator currentStep={currentStep} styles={styles} />

              <View style={styles.header}>
                <Logo size={220} style={styles.logo} />
                <Text style={styles.title}>{tAuth("welcome")}</Text>
                <Text style={styles.subtitle}>{tAuth("createNewPassword")}</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("phoneNumber")}
                    value={formData.phone}
                    editable={false}
                    styleCont={{ opacity: 0.9 }}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("password")}
                    value={formData.password}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, password: text }));
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    isPassword
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Input
                    placeholder={tAuth("confirmPassword")}
                    value={formData.confirmPassword}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, confirmPassword: text }));
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    isPassword
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                </View>

                <View style={styles.buttonWrapper}>
                  <Button onPress={handleResetPassword} disabled={isLoading}>
                    <Text>{isLoading ? "Resetting..." : tAuth("resetPassword")}</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Toggles */}
      <View style={styles.togglesContainer}>
        <View style={styles.togglesRow}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
            <Text style={styles.toggleText}>{isDarkMode ? "🌙" : "☀️"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              const languageCodes = Object.keys(languages);
              const currentIndex = languageCodes.indexOf(currentLanguage);
              const nextIndex = (currentIndex + 1) % languageCodes.length;
              changeLanguage(languageCodes[nextIndex]);
            }}
          >
            <Text style={styles.toggleText}>🌍</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
