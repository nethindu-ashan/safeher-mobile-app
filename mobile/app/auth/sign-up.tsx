import { Ionicons } from "@expo/vector-icons";

import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/raleway";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import { signUp } from "../../src/services/authService";

const logo = require(
  "../../assets/images/logo/safeher-logo.png"
);

const signupHero = require(
  "../../assets/images/auth/signup-hero.png"
);

const BACKGROUND = "#FFFBFD";
const BORDER = "#EDE6F0";
const SOFT_PURPLE = "#F5F0FF";
const INPUT_BACKGROUND = "#FFFFFF";
const MUTED = "#8A8192";

export default function SignUpScreen() {
  const { height } = useWindowDimensions();

const compact = height < 780;

// Increased banner height
const heroHeight = compact ? 155 : 175;

const inputHeight = compact ? 47 : 50;

  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const [
    nameFocused,
    setNameFocused,
  ] = useState(false);

  const [
    emailFocused,
    setEmailFocused,
  ] = useState(false);

  const [
    passwordFocused,
    setPasswordFocused,
  ] = useState(false);

  const [
    confirmFocused,
    setConfirmFocused,
  ] = useState(false);

  const validateForm = () => {
    const cleanName = fullName.trim();

    const cleanEmail =
      email.trim().toLowerCase();

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
    if (!validateForm()) {
      return;
    }

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

      if (!data.session) {
        router.replace({
          pathname: "/auth/verify-email",
          params: {
            email: cleanEmail,
          },
        });

        return;
      }

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

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BACKGROUND,
        }}
      />
    );
  }

  return (
    <SafeAreaView
      edges={[
        "top",
        "bottom",
      ]}
      style={{
        flex: 1,
        backgroundColor: BACKGROUND,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.primaryDark
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
            paddingBottom:
              compact ? 14 : 20,
          }}
        >
          <ImageBackground
            source={signupHero}
            resizeMode="cover"
            style={{
              width: "100%",
              height: heroHeight,
            }}
          >
            <LinearGradient
              colors={[
                "rgba(69,25,150,0.88)",
                "rgba(139,61,255,0.48)",
                "rgba(236,72,153,0.04)",
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
                flex: 1,
                paddingHorizontal: 24,
                paddingTop: 10,
                paddingBottom: 13,
              }}
            >
              <Pressable
                onPress={() =>
                  router.back()
                }
                hitSlop={10}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,

                  borderRadius: 18,

                  alignItems: "center",
                  justifyContent:
                    "center",

                  backgroundColor:
                    "rgba(0,0,0,0.18)",

                  opacity:
                    pressed ? 0.65 : 1,
                })}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>

              <View
                style={{
                  flex: 1,
                  justifyContent:
                    "flex-end",
                }}
              >
                <View
                  style={{
                    width: "66%",
                  }}
                >
                  <Image
                    source={logo}
                    resizeMode="contain"
                    style={{
                      width: 96,
                      height: 31,
                      marginBottom: 4,

                      alignSelf:
                        "flex-start",
                    }}
                  />

                  <Text
                    style={{
                      color: "#FFFFFF",

                      fontFamily:
                        "Raleway_800ExtraBold",

                      fontSize:
                        compact
                          ? 18
                          : 19,

                      lineHeight:
                        compact
                          ? 20
                          : 22,
                    }}
                  >
                    Your safer journey
                  </Text>

                  <Text
                    style={{
                      color: "#FFFFFF",

                      fontFamily:
                        "Raleway_800ExtraBold",

                      fontSize:
                        compact
                          ? 18
                          : 19,

                      lineHeight:
                        compact
                          ? 20
                          : 22,
                    }}
                  >
                    starts here.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>

          <View
            style={{
              paddingHorizontal: 24,

              paddingTop:
  compact ? 28 : 34,
            }}
          >
            <Text
              style={{
                color: COLORS.text,

                fontFamily:
                  "Raleway_800ExtraBold",

                fontSize:
                  compact ? 21 : 23,

                lineHeight:
                  compact ? 25 : 28,

                letterSpacing: -0.3,
              }}
            >
              Create your account
            </Text>

            <Text
              style={{
                marginTop: 3,

                color: MUTED,

                fontFamily:
                  "Raleway_400Regular",

                fontSize: 11,
                lineHeight: 15,
              }}
            >
              Set up your SafeHer account in a few quick steps.
            </Text>

            <View
              style={{
                marginTop:
                  compact ? 15 : 18,
              }}
            >
              <Text
                style={{
                  marginBottom: 5,

                  color: COLORS.text,

                  fontFamily:
                    "Raleway_600SemiBold",

                  fontSize: 11.3,
                }}
              >
                Full name
              </Text>

              <View
                style={{
                  height: inputHeight,

                  flexDirection: "row",

                  alignItems: "center",

                  paddingHorizontal: 14,

                  borderWidth: 1.2,

                  borderColor:
                    nameFocused
                      ? COLORS.primary
                      : BORDER,

                  borderRadius: 15,

                  backgroundColor:
                    INPUT_BACKGROUND,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={
                    nameFocused
                      ? COLORS.primary
                      : MUTED
                  }
                />

                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() =>
                    setNameFocused(true)
                  }
                  onBlur={() =>
                    setNameFocused(false)
                  }
                  placeholder="Enter your full name"
                  placeholderTextColor="#AAA1AE"
                  autoCapitalize="words"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    height: "100%",

                    marginLeft: 10,

                    color: COLORS.text,

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize: 12.3,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                marginTop:
                  compact ? 9 : 11,
              }}
            >
              <Text
                style={{
                  marginBottom: 5,

                  color: COLORS.text,

                  fontFamily:
                    "Raleway_600SemiBold",

                  fontSize: 11.3,
                }}
              >
                Email address
              </Text>

              <View
                style={{
                  height: inputHeight,

                  flexDirection: "row",

                  alignItems: "center",

                  paddingHorizontal: 14,

                  borderWidth: 1.2,

                  borderColor:
                    emailFocused
                      ? COLORS.primary
                      : BORDER,

                  borderRadius: 15,

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
                  onChangeText={setEmail}
                  onFocus={() =>
                    setEmailFocused(true)
                  }
                  onBlur={() =>
                    setEmailFocused(false)
                  }
                  placeholder="name@example.com"
                  placeholderTextColor="#AAA1AE"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    height: "100%",

                    marginLeft: 10,

                    color: COLORS.text,

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize: 12.3,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                marginTop:
                  compact ? 9 : 11,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent:
                    "space-between",

                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,

                    fontFamily:
                      "Raleway_600SemiBold",

                    fontSize: 11.3,
                  }}
                >
                  Password
                </Text>

                <Text
                  style={{
                    color: MUTED,

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize: 9.2,
                  }}
                >
                  8+ characters
                </Text>
              </View>

              <View
                style={{
                  height: inputHeight,

                  flexDirection: "row",

                  alignItems: "center",

                  paddingHorizontal: 14,

                  borderWidth: 1.2,

                  borderColor:
                    passwordFocused
                      ? COLORS.primary
                      : BORDER,

                  borderRadius: 15,

                  backgroundColor:
                    INPUT_BACKGROUND,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={
                    passwordFocused
                      ? COLORS.primary
                      : MUTED
                  }
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() =>
                    setPasswordFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setPasswordFocused(
                      false
                    )
                  }
                  placeholder="Create a password"
                  placeholderTextColor="#AAA1AE"
                  secureTextEntry={
                    !showPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    height: "100%",

                    marginLeft: 10,

                    color: COLORS.text,

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize: 12.3,
                  }}
                />

                <Pressable
                  onPress={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  hitSlop={10}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={19}
                    color={MUTED}
                  />
                </Pressable>
              </View>
            </View>

            <View
              style={{
                marginTop:
                  compact ? 9 : 11,
                  marginBottom: 20,
              }}
            >
              <Text
                style={{
                  marginBottom: 5,

                  color: COLORS.text,

                  fontFamily:
                    "Raleway_600SemiBold",

                  fontSize: 11.3,
                }}
              >
                Confirm password
              </Text>

              <View
                style={{
                  height: inputHeight,

                  flexDirection: "row",

                  alignItems: "center",

                  paddingHorizontal: 14,

                  borderWidth: 1.2,

                  borderColor:
                    confirmFocused
                      ? COLORS.primary
                      : BORDER,

                  borderRadius: 15,

                  backgroundColor:
                    INPUT_BACKGROUND,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={
                    confirmFocused
                      ? COLORS.primary
                      : MUTED
                  }
                />

                <TextInput
                  value={confirmPassword}
                  onChangeText={
                    setConfirmPassword
                  }
                  onFocus={() =>
                    setConfirmFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setConfirmFocused(
                      false
                    )
                  }
                  placeholder="Repeat your password"
                  placeholderTextColor="#AAA1AE"
                  secureTextEntry={
                    !showConfirmPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    height: "100%",

                    marginLeft: 10,

                    color: COLORS.text,

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize: 12.3,
                  }}
                />

                <Pressable
                  onPress={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  hitSlop={10}
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={19}
                    color={MUTED}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleSignUp}
              disabled={loading}
              style={({ pressed }) => ({
                marginTop:
                  compact ? 22 : 25,

                borderRadius: 16,

                overflow: "hidden",

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
                  height:
                    compact ? 49 : 52,

                  borderRadius: 16,

                  alignItems: "center",

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
                      color: "#FFFFFF",

                      fontFamily:
                        "Raleway_700Bold",

                      fontSize: 13,
                    }}
                  >
                    Create Account
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <View
              style={{
                marginTop:
                  compact ? 14 : 17,

                flexDirection: "row",

                alignItems: "center",

                justifyContent:
                  "center",
              }}
            >
              <Text
                style={{
                  color: MUTED,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize: 10.5,
                }}
              >
                Already have an account?{" "}
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    "/auth/sign-in"
                  )
                }
                hitSlop={6}
              >
                <Text
                  style={{
                    color:
                      COLORS.primary,

                    fontFamily:
                      "Raleway_700Bold",

                    fontSize: 10.5,
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>

            <View
              style={{
                marginTop:
                  compact ? 11 : 14,

                flexDirection: "row",

                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,

                  backgroundColor: BORDER,
                }}
              />

              <Text
                style={{
                  marginHorizontal: 10,

                  color: "#A69DAA",

                  fontFamily:
                    "Raleway_500Medium",

                  fontSize: 8.8,
                }}
              >
                or
              </Text>

              <View
                style={{
                  flex: 1,
                  height: 1,

                  backgroundColor: BORDER,
                }}
              />
            </View>

            <View
              style={{
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() =>
                  router.replace("/")
                }
                style={({ pressed }) => ({
                  width: "68%",

                  minHeight:
                    compact ? 42 : 44,

                  marginTop:
                    compact ? 10 : 12,

                  borderRadius: 14,

                  backgroundColor:
                    SOFT_PURPLE,

                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  opacity:
                    pressed
                      ? 0.65
                      : 1,
                })}
              >
             
                <Text
                  style={{
                   

                    color:
                      COLORS.primary,

                    fontFamily:
                      "Raleway_700Bold",

                    fontSize: 10.5,
                  }}
                >
                  Continue as Guest
                </Text>
              </Pressable>

              <Text
                style={{
                  maxWidth: 300,

                  marginTop: 6,

                  paddingHorizontal: 12,

                  color: "#A69DAA",

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize: 8.4,
                  lineHeight: 12,

                  textAlign: "center",
                }}
              >
                Emergency safety features remain available without an account.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}