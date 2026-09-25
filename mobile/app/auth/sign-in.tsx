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
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, GRADIENTS } from "../../src/constants/theme";
import { signIn } from "../../src/services/authService";
import { getMyProfile } from "../../src/services/userService";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert(
        "Missing email",
        "Please enter your email address."
      );

      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert(
        "Invalid email",
        "Please enter a valid email address."
      );

      return false;
    }

    if (!password) {
      Alert.alert(
        "Missing password",
        "Please enter your password."
      );

      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = await signIn({
        email,
        password,
      });

      if (!data.session || !data.user) {
        throw new Error(
          "Unable to create a login session."
        );
      }

      // Creates or retrieves the Prisma user profile.
      await getMyProfile();

      router.replace("/");
    } catch (error) {
      let message =
        error instanceof Error
          ? error.message
          : "Something went wrong while signing in.";

      if (
        message
          .toLowerCase()
          .includes("email not confirmed")
      ) {
        message =
          "Please verify your email address before signing in.";
      }

      if (
        message
          .toLowerCase()
          .includes("invalid login credentials")
      ) {
        message =
          "Incorrect email address or password.";
      }

      Alert.alert(
        "Sign in failed",
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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <View className="pt-3">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={COLORS.text}
              />
            </Pressable>
          </View>

          {/* Header */}
          <View className="mt-12">
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
                name="shield-checkmark-outline"
                size={32}
                color="#FFFFFF"
              />
            </LinearGradient>

            <Text className="mt-7 text-3xl font-bold text-app-text">
              Welcome back
            </Text>

            <Text className="mt-2 text-base leading-6 text-app-muted">
              Sign in to manage your SafeHer profile,
              trusted contacts and personal safety settings.
            </Text>
          </View>

          {/* Form */}
          <View className="mt-9 gap-5">
            {/* Email */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-app-text">
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
            </View>

            {/* Password */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-app-text">
                Password
              </Text>

              <View className="flex-row items-center rounded-2xl border border-app-border bg-white px-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="ml-3 flex-1 py-4 text-base text-app-text"
                />

                <Pressable
                  onPress={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    color={COLORS.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable
              onPress={() =>
                router.push(
                  "/auth/forgot-password"
                )
              }
              className="self-end"
            >
              <Text className="font-semibold text-primary">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          {/* Sign In */}
          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            className="mt-8 overflow-hidden rounded-2xl"
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                minHeight: 56,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-bold text-white">
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Create Account */}
          <View className="mt-7 flex-row justify-center">
            <Text className="text-sm text-app-muted">
  {"Don't have an account? "}
</Text>
            <Pressable
              onPress={() =>
                router.push("/auth/sign-up")
              }
            >
              <Text className="text-sm font-bold text-primary">
                Create Account
              </Text>
            </Pressable>
          </View>

          {/* Guest */}
          <Pressable
            onPress={() =>
              router.replace("/")
            }
            className="mt-8 items-center"
          >
            <Text className="font-semibold text-app-muted">
              Continue as Guest
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}