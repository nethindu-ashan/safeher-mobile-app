import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, GRADIENTS } from "../../src/constants/theme";
import { sendPasswordResetEmail } from "../../src/services/authService";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert(
        "Missing email",
        "Please enter your email address."
      );

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      Alert.alert(
        "Invalid email",
        "Please enter a valid email address."
      );

      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(cleanEmail);

      Alert.alert(
        "Check your email",
        "If an account exists for this email address, password reset instructions have been sent.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/auth/sign-in"),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send password reset email.";

      Alert.alert(
        "Reset failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View className="flex-1 px-6">
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            className="mt-3 h-11 w-11 items-center justify-center rounded-full bg-white"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={COLORS.text}
            />
          </Pressable>

          <View className="mt-14">
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="key-outline"
                size={31}
                color="#FFFFFF"
              />
            </LinearGradient>

            <Text className="mt-7 text-3xl font-bold text-app-text">
              Forgot password?
            </Text>

            <Text className="mt-3 text-base leading-6 text-app-muted">
              Enter the email address associated with
              your SafeHer account.
            </Text>

            <Text className="mb-2 mt-8 text-sm font-semibold text-app-text">
              Email address
            </Text>

            <View className="flex-row items-center rounded-2xl border border-app-border bg-white px-4">
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.textSecondary}
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor={
                  COLORS.textSecondary
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="ml-3 flex-1 py-4 text-base text-app-text"
              />
            </View>

            <Pressable
              onPress={handleResetPassword}
              disabled={loading}
              className="mt-7 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  minHeight: 56,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-bold text-white">
                    Send Reset Email
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() =>
                router.replace("/auth/sign-in")
              }
              className="mt-6 items-center"
            >
              <Text className="font-semibold text-primary">
                Back to Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}