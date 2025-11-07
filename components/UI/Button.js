import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

function Button({ children, onPress, onRelease, styleButton, styleText }) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          width: "100%",
          borderRadius: 10,
          padding: 15,
          backgroundColor: theme.primary,
          justifyContent: "center",
        },
        buttonText: {
          textAlign: "center",
          fontSize: 16,
          color: "#FFFFFF",
          fontWeight: "600",
        },
        pressed: {
          opacity: 0.1,
          backgroundColor: theme.primary,
          borderRadius: 10,
        },
      }),
    [theme]
  );

  return (
    <Pressable
      onPress={onPress}
      onRelease={onRelease}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, styleButton]}
    >
      <Text style={[styles.buttonText, styleText]}>{children}</Text>
    </Pressable>
  );
}

export default Button;
