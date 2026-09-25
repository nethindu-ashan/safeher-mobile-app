import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  COLORS,
  GRADIENTS,
} from "../../src/constants/theme";

import {
  resendSignupOtp,
  verifyEmailOtp,
} from "../../src/services/authService";

import { getMyProfile } from "../../src/services/userService";

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (!email) {
      Alert.alert(
        "Missing email",
        "We could not find the email address for this verification."
      );
      return;
    }

    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      Alert.alert(
        "Missing code",
        "Please enter the verification code sent to your email."
      );
      return;
    }

    if (cleanOtp.length !== 8) {
      Alert.alert(
        "Invalid code",
        "Please enter the complete 8-digit verification code."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await verifyEmailOtp(
        email,
        cleanOtp
      );

      if (!data.user) {
        throw new Error(
          "Unable to verify your SafeHer account."
        );
      }

      if (data.session) {
        await getMyProfile();
      }

      Alert.alert(
        "Account verified",
        "Your SafeHer account has been verified successfully.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.replace("/"),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to verify the code.";

      Alert.alert(
        "Verification failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert(
        "Missing email",
        "We could not find your email address."
      );
      return;
    }

    if (countdown > 0) {
      return;
    }

    try {
      setResending(true);

      await resendSignupOtp(email);

      setCountdown(60);

      Alert.alert(
        "New code sent",
        "A new verification code has been sent to your email."
      );
    } catch (error) {
      let message =
        error instanceof Error
          ? error.message
          : "Unable to resend the verification code.";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("rate") ||
        lowerMessage.includes("too many")
      ) {
        message =
          "Please wait before requesting another verification code.";
      }

      Alert.alert(
        "Resend failed",
        message
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-6">
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

        <View className="flex-1 items-center justify-center">
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 82,
              height: 82,
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="mail-outline"
              size={40}
              color="#FFFFFF"
            />
          </LinearGradient>

          <Text className="mt-8 text-center text-3xl font-bold text-app-text">
            Verify your email
          </Text>

          <Text className="mt-3 text-center text-base leading-6 text-app-muted">
            Enter the 8-digit verification code sent to
          </Text>

          {!!email && (
            <Text className="mt-1 text-center text-base font-bold text-primary">
              {email}
            </Text>
          )}

          <TextInput
            value={otp}
            onChangeText={(value) =>
              setOtp(
                value.replace(/[^0-9]/g, "")
              )
            }
            placeholder="00000000"
            placeholderTextColor={
              COLORS.textSecondary
            }
            keyboardType="number-pad"
            maxLength={8}
            textAlign="center"
            className="mt-8 w-full rounded-2xl border border-app-border bg-white px-4 py-4 text-2xl font-bold tracking-widest text-app-text"
          />

          <Pressable
            onPress={handleVerify}
            disabled={loading}
            className="mt-6 w-full overflow-hidden rounded-2xl active:opacity-80"
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
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text className="text-base font-bold text-white">
                  Verify Email
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          <View className="mt-6 flex-row items-center">
            <Text className="text-sm text-app-muted">
              {"Didn't receive the code? "}
            </Text>

            <Pressable
              onPress={handleResend}
              disabled={
                resending || countdown > 0
              }
            >
              <Text
                className={
                  countdown > 0
                    ? "text-sm font-bold text-app-muted"
                    : "text-sm font-bold text-primary"
                }
              >
                {resending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              router.replace("/auth/sign-in")
            }
            className="mt-6"
          >
            <Text className="font-semibold text-app-muted">
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}