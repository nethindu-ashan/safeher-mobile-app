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
import { router, useLocalSearchParams } from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";

import {
  resendSignupOtp,
  verifyEmailOtp,
} from "../../src/services/authService";

import { getMyProfile } from "../../src/services/userService";

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

export default function VerifyEmailScreen() {
  const { email } =
    useLocalSearchParams<{
      email?: string;
    }>();

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

  const [otp, setOtp] =
    useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    resending,
    setResending,
  ] = useState(false);

  const [
    countdown,
    setCountdown,
  ] = useState(60);

  /* ==========================================================
     COUNTDOWN
     ========================================================== */

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer =
      setInterval(() => {
        setCountdown(
          (current) => {
            if (current <= 1) {
              clearInterval(
                timer
              );

              return 0;
            }

            return (
              current - 1
            );
          }
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  /* ==========================================================
     VERIFY EMAIL
     ========================================================== */

  const handleVerify =
    async () => {
      if (!email) {
        Alert.alert(
          "Missing email",
          "We could not find the email address for this verification."
        );

        return;
      }

      const cleanOtp =
        otp.trim();

      if (!cleanOtp) {
        Alert.alert(
          "Missing code",
          "Please enter the verification code sent to your email."
        );

        return;
      }

      if (
        cleanOtp.length !==
        8
      ) {
        Alert.alert(
          "Invalid code",
          "Please enter the complete 8-digit verification code."
        );

        return;
      }

      try {
        setLoading(true);

        const data =
          await verifyEmailOtp(
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
              text:
                "Continue",

              onPress:
                () =>
                  router.replace(
                    "/"
                  ),
            },
          ]
        );
      } catch (error) {
        const message =
          error instanceof
          Error
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

  /* ==========================================================
     RESEND OTP
     ========================================================== */

  const handleResend =
    async () => {
      if (!email) {
        Alert.alert(
          "Missing email",
          "We could not find your email address."
        );

        return;
      }

      if (
        countdown > 0
      ) {
        return;
      }

      try {
        setResending(true);

        await resendSignupOtp(
          email
        );

        setCountdown(60);

        Alert.alert(
          "New code sent",
          "A new verification code has been sent to your email."
        );
      } catch (error) {
        let message =
          error instanceof
          Error
            ? error.message
            : "Unable to resend the verification code.";

        const lowerMessage =
          message.toLowerCase();

        if (
          lowerMessage.includes(
            "rate"
          ) ||
          lowerMessage.includes(
            "too many"
          )
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
            : undefined
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
                35,
            }}
          >
            {/* =================================================
                MAIL ICON
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
                    name="mail-outline"

                    size={31}

                    color="#FFFFFF"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* =================================================
                SAFEHER COLOR LOGO
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
              Verify your email
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
              Enter the 8-digit verification code we sent to your email address.
            </Text>

            {/* =================================================
                EMAIL
                ================================================= */}

            {!!email && (
              <View
                style={{
                  alignSelf:
                    "center",

                  maxWidth:
                    "92%",

                  marginTop: 14,

                  paddingHorizontal:
                    14,

                  paddingVertical:
                    8,

                  borderRadius:
                    12,

                  backgroundColor:
                    SOFT_PURPLE,

                  flexDirection:
                    "row",

                  alignItems:
                    "center",
                }}
              >
                <Ionicons
                  name="mail-outline"

                  size={14}

                  color={
                    COLORS.primary
                  }
                />

                <Text
                  numberOfLines={1}

                  style={{
                    marginLeft:
                      7,

                    color:
                      COLORS.primary,

                    fontFamily:
                      "Raleway_600SemiBold",

                    fontSize:
                      10.5,
                  }}
                >
                  {email}
                </Text>
              </View>
            )}

            {/* =================================================
                VERIFICATION CODE
                ================================================= */}

            <View
              style={{
                marginTop: 26,
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
                Verification code
              </Text>

              {/* OTP INPUT */}

              <View
                style={{
                  height: 54,

                  borderRadius:
                    15,

                  borderWidth:
                    1.2,

                  borderColor:
                    otp.length === 8
                      ? COLORS.primary
                      : BORDER,

                  backgroundColor:
                    INPUT_BACKGROUND,

                  justifyContent:
                    "center",

                  paddingHorizontal:
                    14,
                }}
              >
                <TextInput
                  value={otp}

                  onChangeText={(
                    value
                  ) =>
                    setOtp(
                      value.replace(
                        /[^0-9]/g,
                        ""
                      )
                    )
                  }

                  placeholder="00000000"

                  placeholderTextColor={
                    "#C0B9C3"
                  }

                  keyboardType="number-pad"

                  maxLength={8}

                  textAlign="center"

                  selectionColor={
                    COLORS.primary
                  }

                  style={{
                    width:
                      "100%",

                    height:
                      "100%",

                    color:
                      DARK_PURPLE,

                    fontFamily:
                      "Raleway_700Bold",

                    fontSize:
                      22,

                    letterSpacing:
                      8,
                  }}
                />
              </View>

              {/* HELPER TEXT */}

              <Text
                style={{
                  marginTop: 5,
                  marginBottom: 20,

                  color:
                    LIGHT_MUTED,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize:
                    8.8,

                  textAlign:
                    "center",
                }}
              >
                The code contains 8 digits
              </Text>
            </View>

            {/* =================================================
                VERIFY BUTTON

                More gap added here
                ================================================= */}

            <Pressable
              onPress={
                handleVerify
              }

              disabled={
                loading
              }

              style={({
                pressed,
              }) => ({
                marginTop: 28,

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
                  <Text
                    style={{
                      color:
                        "#FFFFFF",

                      fontFamily:
                        "Raleway_700Bold",

                      fontSize:
                        13,
                    }}
                  >
                    Verify Email
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* =================================================
                RESEND
                ================================================= */}

            <View
              style={{
                marginTop: 18,

                flexDirection:
                  "row",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <Text
                style={{
                  color:
                    MUTED,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize:
                    10.5,
                }}
              >
                Didn&apos;t receive the code?{" "}
              </Text>

              <Pressable
                onPress={
                  handleResend
                }

                disabled={
                  resending ||
                  countdown > 0
                }

                hitSlop={6}
              >
                <Text
                  style={{
                    color:
                      countdown > 0
                        ? LIGHT_MUTED
                        : COLORS.primary,

                    fontFamily:
                      "Raleway_700Bold",

                    fontSize:
                      10.5,
                  }}
                >
                  {resending
                    ? "Sending..."
                    : countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend Code"}
                </Text>
              </Pressable>
            </View>

            {/* =================================================
                DIVIDER
                ================================================= */}

            <View
              style={{
                marginTop: 21,

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
                  marginLeft:
                    5,

                  color:
                    LIGHT_MUTED,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize:
                    8.5,
                }}
              >
                Your verification code helps keep your SafeHer account secure.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}