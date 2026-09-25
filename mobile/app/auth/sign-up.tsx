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

import {
  COLORS,
  GRADIENTS,
} from "../../src/constants/theme";

import { signUp } from "../../src/services/authService";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      Alert.alert(
        "Missing name",
        "Please enter your full name."
      );

      return false;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        "Invalid name",
        "Please enter a valid full name."
      );

      return false;
    }

    if (!cleanEmail) {
      Alert.alert(
        "Missing email",
        "Please enter your email address."
      );

      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      Alert.alert(
        "Invalid email",
        "Please enter a valid email address."
      );

      return false;
    }

    if (!password) {
      Alert.alert(
        "Missing password",
        "Please enter a password."
      );

      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Your password must contain at least 8 characters."
      );

      return false;
    }

    if (!confirmPassword) {
      Alert.alert(
        "Confirm password",
        "Please enter your password again."
      );

      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords are the same."
      );

      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const cleanEmail =
        email.trim().toLowerCase();

      const data = await signUp({
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
      });

      if (!data.user) {
        throw new Error(
          "Unable to create your SafeHer account."
        );
      }

      /*
       * Email confirmation is enabled.
       *
       * Supabase creates the user first,
       * then sends the OTP verification code.
       *
       * Usually there is no authenticated session
       * until the OTP is successfully verified.
       */
      if (!data.session) {
        router.replace({
          pathname: "/auth/verify-email",
          params: {
            email: cleanEmail,
          },
        });

        return;
      }

      /*
       * This is only a fallback in case
       * email confirmation is disabled.
       */
      Alert.alert(
        "Account created",
        "Your SafeHer account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.replace("/"),
          },
        ]
      );
    } catch (error) {
      let message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your account.";

      const lowerMessage =
        message.toLowerCase();

      if (
        lowerMessage.includes(
          "user already registered"
        )
      ) {
        message =
          "An account already exists with this email address.";
      }

      if (
        lowerMessage.includes(
          "email rate limit"
        )
      ) {
        message =
          "Too many verification emails were requested. Please wait a little and try again.";
      }

      Alert.alert(
        "Sign up failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
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
              className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-70"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={COLORS.text}
              />
            </Pressable>
          </View>

          {/* Header */}
          <View className="mt-7">
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 19,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={31}
                color="#FFFFFF"
              />
            </LinearGradient>

            <Text className="mt-6 text-3xl font-bold text-app-text">
              Create your account
            </Text>

            <Text className="mt-2 text-base leading-6 text-app-muted">
              Create a SafeHer account to manage
              your profile, notification preferences
              and personal safety information.
            </Text>
          </View>

          {/* Form */}
          <View className="mt-8 gap-5">
            {/* Full Name */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-app-text">
                Full name
              </Text>

              <View className="flex-row items-center rounded-2xl border border-app-border bg-white px-4">
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />

                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="ml-3 flex-1 py-4 text-base text-app-text"
                />
              </View>
            </View>

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
                  placeholder="Minimum 8 characters"
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

            {/* Confirm Password */}
            <View>
              <Text className="mb-2 text-sm font-semibold text-app-text">
                Confirm password
              </Text>

              <View className="flex-row items-center rounded-2xl border border-app-border bg-white px-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />

                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Enter your password again"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  secureTextEntry={
                    !showConfirmPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="ml-3 flex-1 py-4 text-base text-app-text"
                />

                <Pressable
                  onPress={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    color={COLORS.textSecondary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Password Information */}
          <View className="mt-5 flex-row rounded-2xl bg-light-purple p-4">
            <Ionicons
              name="information-circle-outline"
              size={21}
              color={COLORS.primary}
            />

            <Text className="ml-3 flex-1 text-xs leading-5 text-app-muted">
              Use at least 8 characters for your password.
              Never share your password or verification
              code with another person.
            </Text>
          </View>

          {/* Create Account */}
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className="mt-7 overflow-hidden rounded-2xl active:opacity-80"
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
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text className="text-base font-bold text-white">
                  Create Account
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Existing Account */}
          <View className="mt-7 flex-row justify-center">
            <Text className="text-sm text-app-muted">
              {"Already have an account? "}
            </Text>

            <Pressable
              onPress={() =>
                router.push("/auth/sign-in")
              }
            >
              <Text className="text-sm font-bold text-primary">
                Sign In
              </Text>
            </Pressable>
          </View>

          {/* Guest */}
          <Pressable
            onPress={() =>
              router.replace("/")
            }
            className="mt-6 items-center"
          >
            <Text className="font-semibold text-app-muted">
              Continue as Guest
            </Text>
          </Pressable>

          {/* Safety Message */}
          <Text className="mt-7 text-center text-xs leading-5 text-app-muted">
            Critical SafeHer safety features remain
            available without creating an account.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}