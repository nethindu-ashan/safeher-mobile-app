import { Ionicons } from "@expo/vector-icons";

import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";

import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";

import {
  sendPasswordResetEmail,
} from "../../src/services/authService";

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND = "#FFFBFD";
const INPUT_BACKGROUND = "#FFFFFF";
const BORDER = "#EDE6F0";
const SOFT_PURPLE = "#F5F0FF";

const MUTED = "#8A8192";
const LIGHT_MUTED = "#AAA1AE";

const DARK_PURPLE = "#40136F";

/* ============================================================
   SCREEN
   ============================================================ */

export default function ForgotPasswordScreen() {
  /* ==========================================================
     FONTS
     ========================================================== */

  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
  });

  /* ==========================================================
     STATE
     ========================================================== */

  const [email, setEmail] =
    useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    emailFocused,
    setEmailFocused,
  ] = useState(false);

  /* ==========================================================
     RESET PASSWORD
     ========================================================== */

  const handleResetPassword =
    async () => {
      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      if (!cleanEmail) {
        Alert.alert(
          "Missing email",
          "Please enter your email address."
        );

        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          cleanEmail
        )
      ) {
        Alert.alert(
          "Invalid email",
          "Please enter a valid email address."
        );

        return;
      }

      try {
        setLoading(true);

        await sendPasswordResetEmail(
          cleanEmail
        );

        Alert.alert(
          "Check your email",
          "If an account exists for this email address, password reset instructions have been sent.",
          [
            {
              text: "OK",

              onPress: () =>
                router.replace(
                  "/auth/sign-in"
                ),
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

  /* ==========================================================
     FONT LOADING
     ========================================================== */

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            BACKGROUND,
        }}
      />
    );
  }

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <SafeAreaView
      edges={[
        "top",
        "bottom",
      ]}
      style={{
        flex: 1,

        backgroundColor:
          BACKGROUND,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          BACKGROUND
        }
      />

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? 0
            : 10
        }
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,

            paddingHorizontal:
              24,

            paddingBottom:
              20,
          }}
        >
          {/* ==================================================
              TOP BAR
              ================================================== */}

          <View
            style={{
              paddingTop: 8,

              alignItems:
                "flex-start",
            }}
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              hitSlop={10}
              style={({
                pressed,
              }) => ({
                width: 38,

                height: 38,

                borderRadius:
                  19,

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backgroundColor:
                  "#FFFFFF",

                borderWidth:
                  1,

                borderColor:
                  BORDER,

                opacity:
                  pressed
                    ? 0.65
                    : 1,
              })}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={
                  DARK_PURPLE
                }
              />
            </Pressable>
          </View>

          {/* ==================================================
              MAIN CONTENT
              ================================================== */}

          <View
            style={{
              flex: 1,

              justifyContent:
                "center",

              paddingBottom:
                40,
            }}
          >
            {/* =================================================
                RESET ICON
                ================================================= */}

            <View
              style={{
                alignItems:
                  "center",
              }}
            >
              <View
                style={{
                  width: 74,

                  height: 74,

                  borderRadius:
                    24,

                  padding: 5,

                  backgroundColor:
                    SOFT_PURPLE,
                }}
              >
                <LinearGradient
                  colors={[
                    COLORS.primaryDark,
                    COLORS.primary,
                    COLORS.pink,
                  ]}
                  start={{
                    x: 0,
                    y: 0,
                  }}
                  end={{
                    x: 1,
                    y: 1,
                  }}
                  style={{
                    flex: 1,

                    borderRadius:
                      20,

                    alignItems:
                      "center",

                    justifyContent:
                      "center",
                  }}
                >
                  <Ionicons
                    name="key-outline"
                    size={31}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* =================================================
                SAFEHER LOGO
                ================================================= */}

            <Image
              source={require(
                "../../assets/images/logo/color-logo.png"
              )}
              resizeMode="contain"
              style={{
                width: 115,

                height: 42,

                alignSelf:
                  "center",

                marginTop: 18,
              }}
            />

            {/* =================================================
                TITLE
                ================================================= */}

            <Text
              style={{
                marginTop: 8,

                color:
                  COLORS.text,

                textAlign:
                  "center",

                fontFamily:
                  "Raleway_800ExtraBold",

                fontSize: 24,

                lineHeight: 29,

                letterSpacing:
                  -0.4,
              }}
            >
              Forgot password?
            </Text>

            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <Text
              style={{
                maxWidth: 310,

                alignSelf:
                  "center",

                marginTop: 7,

                color:
                  MUTED,

                textAlign:
                  "center",

                fontFamily:
                  "Raleway_400Regular",

                fontSize:
                  11.5,

                lineHeight:
                  17,
              }}
            >
              Enter the email address associated with your SafeHer account.
              We&apos;ll send you instructions to reset your password.
            </Text>

            {/* =================================================
                EMAIL
                ================================================= */}

            <View
              style={{
                marginTop: 28,
              }}
            >
              <Text
                style={{
                  marginBottom:
                    6,

                  color:
                    COLORS.text,

                  fontFamily:
                    "Raleway_600SemiBold",

                  fontSize:
                    11.3,
                }}
              >
                Email address
              </Text>

              <View
                style={{
                  height: 52,

                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  paddingHorizontal:
                    14,

                  borderRadius:
                    15,

                  borderWidth:
                    1.2,

                  borderColor:
                    emailFocused
                      ? COLORS.primary
                      : BORDER,

                  backgroundColor:
                    INPUT_BACKGROUND,
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={
                    emailFocused
                      ? COLORS.primary
                      : MUTED
                  }
                />

                <TextInput
                  value={email}
                  onChangeText={
                    setEmail
                  }
                  onFocus={() =>
                    setEmailFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setEmailFocused(
                      false
                    )
                  }
                  placeholder="name@example.com"
                  placeholderTextColor="#AAA1AE"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                  autoComplete="email"
                  textContentType="emailAddress"
                  selectionColor={
                    COLORS.primary
                  }
                  style={{
                    flex: 1,

                    height:
                      "100%",

                    marginLeft:
                      10,

                    color:
                      COLORS.text,

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize:
                      12.3,
                  }}
                />
              </View>

              {/* SMALL HELPER TEXT */}

              <Text
                style={{
                  marginTop: 6,
                  marginBottom: 18,

                  color:
                    LIGHT_MUTED,

                  textAlign:
                    "center",

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize:
                    8.8,

                  lineHeight:
                    12,
                }}
              >
                We&apos;ll send reset instructions to this email address.
              </Text>
            </View>

            {/* =================================================
                SEND RESET EMAIL BUTTON
                ================================================= */}

            <Pressable
              onPress={
                handleResetPassword
              }
              disabled={
                loading
              }
              style={({
                pressed,
              }) => ({
                marginTop: 25,

                borderRadius:
                  16,

                overflow:
                  "hidden",

                opacity:
                  loading
                    ? 0.62
                    : pressed
                    ? 0.86
                    : 1,
              })}
            >
              <LinearGradient
                colors={[
                  COLORS.primaryDark,
                  COLORS.primary,
                  COLORS.pink,
                ]}
                start={{
                  x: 0,
                  y: 0.5,
                }}
                end={{
                  x: 1,
                  y: 0.5,
                }}
                style={{
                  height: 51,

                  borderRadius:
                    16,

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <View
                    style={{
                      flexDirection:
                        "row",

                      alignItems:
                        "center",
                    }}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={15}
                      color="#FFFFFF"
                    />

                    <Text
                      style={{
                        marginLeft:
                          7,

                        color:
                          "#FFFFFF",

                        fontFamily:
                          "Raleway_700Bold",

                        fontSize:
                          13,
                      }}
                    >
                      Send Reset Email
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Pressable>

            {/* =================================================
                DIVIDER
                ================================================= */}

            <View
              style={{
                marginTop: 23,

                flexDirection:
                  "row",

                alignItems:
                  "center",
              }}
            >
              <View
                style={{
                  flex: 1,

                  height: 1,

                  backgroundColor:
                    BORDER,
                }}
              />

              <View
                style={{
                  width: 10,
                }}
              />

              <View
                style={{
                  flex: 1,

                  height: 1,

                  backgroundColor:
                    BORDER,
                }}
              />
            </View>

            {/* =================================================
                BACK TO SIGN IN
                ================================================= */}

            <Pressable
              onPress={() =>
                router.replace(
                  "/auth/sign-in"
                )
              }
              style={({
                pressed,
              }) => ({
                alignSelf:
                  "center",

                marginTop: 16,

                paddingHorizontal:
                  18,

                paddingVertical:
                  8,

                borderRadius:
                  12,

                backgroundColor:
                  SOFT_PURPLE,

                opacity:
                  pressed
                    ? 0.65
                    : 1,
              })}
            >
              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",
                }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={13}
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={{
                    marginLeft: 6,

                    color:
                      COLORS.primary,

                    fontFamily:
                      "Raleway_700Bold",

                    fontSize:
                      10.5,
                  }}
                >
                  Back to Sign In
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ==================================================
              SECURITY NOTE
              ================================================== */}

          <View
            style={{
              alignItems:
                "center",

              paddingBottom:
                4,
            }}
          >
            <View
              style={{
                flexDirection:
                  "row",

                alignItems:
                  "center",

                paddingHorizontal:
                  12,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={11}
                color={
                  LIGHT_MUTED
                }
              />

              <Text
                style={{
                  marginLeft: 5,

                  color:
                    LIGHT_MUTED,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize:
                    8.5,

                  textAlign:
                    "center",
                }}
              >
                SafeHer keeps your account recovery information secure.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}