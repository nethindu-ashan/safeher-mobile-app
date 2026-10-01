import { Ionicons } from "@expo/vector-icons";

import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";

import {
  NotoSansTamil_600SemiBold,
  NotoSansTamil_700Bold,
} from "@expo-google-fonts/noto-sans-tamil";

import {
  NotoSansSinhala_800ExtraBold,
} from "@expo-google-fonts/noto-sans-sinhala";

import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  useEffect,
  useState,
} from "react";

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
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import { signIn } from "../../src/services/authService";
import { getMyProfile } from "../../src/services/userService";

/* ============================================================
   HERO SLIDES
   ============================================================ */

const heroSlides = [
  {
    image: require(
      "../../assets/images/auth/login-hero-1.png"
    ),

    language: "english",

    text:
      "Every woman deserves a safe journey.",
  },

  {
    image: require(
      "../../assets/images/auth/login-hero-2.png"
    ),

    language: "sinhala",

    text:
      "ඔබේ සුරක්ෂිතභාවය, අපගේ වගකීමයි.",
  },

  {
    image: require(
      "../../assets/images/auth/login-hero-3.png"
    ),

    language: "tamil",

    text:
      "ஒவ்வொரு பெண்ணுக்கும் பாதுகாப்பான பயணம் உரியது.",
  },
];

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND = "#FFFBFD";
const BORDER = "#EDE6F0";
const SOFT_PURPLE = "#F5F0FF";
const INPUT_BACKGROUND = "#FFFFFF";
const MUTED = "#8A8192";

const HERO_TEXT = "#3C086C";

/* ============================================================
   SCREEN
   ============================================================ */

export default function SignInScreen() {
  const { height } =
    useWindowDimensions();

  const compact =
    height < 780;

  const heroHeight =
    compact ? 278 : 313;

  const inputHeight =
    compact ? 47 : 50;

  /* ==========================================================
     FONTS
     ========================================================== */

  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,

    NotoSansTamil_600SemiBold,
    NotoSansTamil_700Bold,

    NotoSansSinhala_800ExtraBold,
  });

  /* ==========================================================
     SLIDESHOW
     ========================================================== */

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);

  useEffect(() => {
    const interval =
      setInterval(() => {
        setCurrentSlide(
          (current) =>
            (current + 1) %
            heroSlides.length
        );
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const activeHero =
    heroSlides[currentSlide];

  /* ==========================================================
     FORM STATE
     ========================================================== */

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    emailFocused,
    setEmailFocused,
  ] = useState(false);

  const [
    passwordFocused,
    setPasswordFocused,
  ] = useState(false);

  /* ==========================================================
     VALIDATION
     ========================================================== */

  const validateForm = () => {
    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      Alert.alert(
        "Missing email",
        "Please enter your email address."
      );

      return false;
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

  /* ==========================================================
     SIGN IN
     ========================================================== */

  const handleSignIn =
    async () => {
      if (!validateForm()) {
        return;
      }

      try {
        setLoading(true);

        const data =
          await signIn({
            email: email
              .trim()
              .toLowerCase(),

            password,
          });

        if (
          !data.session ||
          !data.user
        ) {
          throw new Error(
            "Unable to create a login session."
          );
        }

        const profileResponse =
          await getMyProfile();

        const role =
          profileResponse
            .data
            .role;

        if (
          role === "ADMIN"
        ) {
          router.replace(
            "/admin"
          );
        } else {
          router.replace(
            "/"
          );
        }
      } catch (error) {
        let message =
          error instanceof Error
            ? error.message
            : "Something went wrong while signing in.";

        const lowerMessage =
          message.toLowerCase();

        if (
          lowerMessage.includes(
            "email not confirmed"
          )
        ) {
          message =
            "Please verify your email address before signing in.";
        }

        if (
          lowerMessage.includes(
            "invalid login credentials"
          )
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

  /* ==========================================================
     HERO TEXT STYLE
     ========================================================== */

  const getHeroTextStyle =
    () => {
      /* ======================================================
         ENGLISH
         Raleway Medium
         ====================================================== */

      if (
        activeHero.language ===
        "english"
      ) {
        return {
          fontFamily: "Raleway_600SemiBold",

          fontSize:
            compact
              ? 21
              : 23,

          lineHeight:
            compact
              ? 26
              : 28,

          letterSpacing:
            -0.2,
        };
      }

      /* ======================================================
         SINHALA
         ====================================================== */

      if (
        activeHero.language ===
        "sinhala"
      ) {
        return {
          fontFamily:
            "NotoSansSinhala_800ExtraBold",

          fontSize:
            compact
              ? 19
              : 21,

          lineHeight:
            compact
              ? 28
              : 31,

          letterSpacing: 0,
        };
      }

      /* ======================================================
         TAMIL
         ====================================================== */

      return {
        fontFamily:
          "NotoSansTamil_600SemiBold",

        fontSize:
          compact
            ? 17
            : 19,

        lineHeight:
          compact
            ? 27
            : 30,

        letterSpacing: 0,
      };
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
              compact
                ? 10
                : 14,
          }}
        >
          {/* ==================================================
              HERO
              ================================================== */}

          <View
            style={{
              width: "100%",

              height:
                heroHeight,

              position:
                "relative",

              overflow:
                "hidden",

              backgroundColor:
                "#FFFFFF",
            }}
          >
            {/* =================================================
                ORIGINAL IMAGE
                ================================================= */}

            <Image
              key={`hero-${currentSlide}`}

              source={
                activeHero.image
              }

              resizeMode="contain"

              style={{
                position:
                  "absolute",

                top: 0,
                bottom: 0,
                left: 0,
                right: 0,

                width:
                  "100%",

                height:
                  "100%",

                opacity: 1,
              }}
            />

            {/* =================================================
                LEFT #EEAAFF BLEND ONLY
                ================================================= */}

            <LinearGradient
              pointerEvents="none"

              colors={[
                "rgba(238,170,255,0.76)",

                "rgba(238,170,255,0.68)",

                "rgba(238,170,255,0.52)",

                "rgba(238,170,255,0.28)",

                "rgba(238,170,255,0.08)",

                "rgba(238,170,255,0.00)",
              ]}

              locations={[
                0,
                0.20,
                0.40,
                0.63,
                0.82,
                1,
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
                position:
                  "absolute",

                left: 0,

                top: 0,

                bottom: 0,

                width:
                  "58%",
              }}
            />

            {/* =================================================
                HERO CONTENT
                ================================================= */}

            <View
              style={{
                position:
                  "absolute",

                top: 0,
                bottom: 0,
                left: 0,
                right: 0,

                paddingHorizontal:
                  24,

                paddingTop:
                  10,

                paddingBottom:
                  20,
              }}
            >
              {/* BACK BUTTON */}

              <Pressable
                onPress={() =>
                  router.back()
                }

                hitSlop={10}

                style={({
                  pressed,
                }) => ({
                  width: 34,

                  height: 34,

                  borderRadius:
                    17,

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  backgroundColor:
                    "rgba(60,8,108,0.72)",

                  opacity:
                    pressed
                      ? 0.65
                      : 1,
                })}
              >
                <Ionicons
                  name="chevron-back"

                  size={19}

                  color="#FFFFFF"
                />
              </Pressable>

              {/* HERO TEXT */}

              <View
                style={{
                  flex: 1,

                  justifyContent:
                    "flex-end",
                }}
              >
                <View
                  style={{
                    width:
                      "56%",
                  }}
                >
                  <Text
                    style={[
                      {
                        color:
                          HERO_TEXT,
                      },

                      getHeroTextStyle(),
                    ]}
                  >
                    {
                      activeHero.text
                    }
                  </Text>

                  {/* ===========================================
                      SMALL WHITE DOTS
                      =========================================== */}

                  <View
                    style={{
                      marginTop:
                        12,

                      flexDirection:
                        "row",

                      alignItems:
                        "center",
                    }}
                  >
                    {heroSlides.map(
                      (
                        _,
                        index
                      ) => {
                        const active =
                          currentSlide ===
                          index;

                        return (
                          <View
                            key={
                              index
                            }

                            style={{
                              width:
                                active
                                  ? 11
                                  : 5,

                              height:
                                5,

                              marginRight:
                                5,

                              borderRadius:
                                3,

                              backgroundColor:
                                active
                                  ? "#FFFFFF"
                                  : "rgba(255,255,255,0.58)",
                            }}
                          />
                        );
                      }
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ==================================================
              LOGIN FORM
              ================================================== */}

          <View
            style={{
              paddingHorizontal:
                24,

              paddingTop:
                compact
                  ? 24
                  : 28,
            }}
          >
            {/* WELCOME */}

            <Text
              style={{
                color:
                  COLORS.text,

                fontFamily:
                  "Raleway_800ExtraBold",

                fontSize:
                  compact
                    ? 21
                    : 23,

                lineHeight:
                  compact
                    ? 25
                    : 28,

                letterSpacing:
                  -0.3,
              }}
            >
              Welcome back
            </Text>

            <Text
              style={{
                marginTop:
                  3,

                color:
                  MUTED,

                fontFamily:
                  "Raleway_400Regular",

                fontSize:
                  11,

                lineHeight:
                  15,
              }}
            >
              Sign in to continue to your SafeHer account.
            </Text>

            {/* =================================================
                EMAIL
                ================================================= */}

            <View
              style={{
                marginTop:
                  compact
                    ? 16
                    : 18,
              }}
            >
              <Text
                style={{
                  marginBottom:
                    5,

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
                  height:
                    inputHeight,

                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  paddingHorizontal:
                    14,

                  borderWidth:
                    1.2,

                  borderColor:
                    emailFocused
                      ? COLORS.primary
                      : BORDER,

                  borderRadius:
                    15,

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
                  value={
                    email
                  }

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
            </View>

            {/* =================================================
                PASSWORD
                ================================================= */}

            <View
              style={{
                marginTop:
                  compact
                    ? 9
                    : 11,
              }}
            >
              <Text
                style={{
                  marginBottom:
                    5,

                  color:
                    COLORS.text,

                  fontFamily:
                    "Raleway_600SemiBold",

                  fontSize:
                    11.3,
                }}
              >
                Password
              </Text>

              <View
                style={{
                  height:
                    inputHeight,

                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  paddingHorizontal:
                    14,

                  borderWidth:
                    1.2,

                  borderColor:
                    passwordFocused
                      ? COLORS.primary
                      : BORDER,

                  borderRadius:
                    15,

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
                  value={
                    password
                  }

                  onChangeText={
                    setPassword
                  }

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

                  placeholder="Enter your password"

                  placeholderTextColor="#AAA1AE"

                  secureTextEntry={
                    !showPassword
                  }

                  autoCapitalize="none"

                  autoCorrect={
                    false
                  }

                  autoComplete="password"

                  textContentType="password"

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

                <Pressable
                  onPress={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
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

                    color={
                      MUTED
                    }
                  />
                </Pressable>
              </View>
            </View>

            {/* =================================================
                FORGOT PASSWORD
                ================================================= */}

            <View
              style={{
                alignItems:
                  "flex-end",

                marginTop:
                  compact
                    ? 7
                    : 8,

                marginBottom:
                  compact
                    ? 18
                    : 20,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push(
                    "/auth/forgot-password"
                  )
                }

                hitSlop={8}

                style={({
                  pressed,
                }) => ({
                  paddingVertical:
                    3,

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

                    fontSize:
                      10.8,
                  }}
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* =================================================
                SIGN IN
                ================================================= */}

            <Pressable
              onPress={
                handleSignIn
              }

              disabled={
                loading
              }

              style={({
                pressed,
              }) => ({
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
                  height:
                    compact
                      ? 49
                      : 52,

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
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* =================================================
                CREATE ACCOUNT
                ================================================= */}

            <View
              style={{
                marginTop:
                  compact
                    ? 14
                    : 16,

                flexDirection:
                  "row",

                justifyContent:
                  "center",

                alignItems:
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
                New to SafeHer?{" "}
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    "/auth/sign-up"
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

                    fontSize:
                      10.5,
                  }}
                >
                  Create Account
                </Text>
              </Pressable>
            </View>

            {/* =================================================
                DIVIDER
                ================================================= */}

            <View
              style={{
                marginTop:
                  compact
                    ? 10
                    : 12,

                flexDirection:
                  "row",

                alignItems:
                  "center",
              }}
            >
              <View
                style={{
                  flex: 1,

                  height:
                    1,

                  backgroundColor:
                    BORDER,
                }}
              />

              <Text
                style={{
                  marginHorizontal:
                    10,

                  color:
                    "#A69DAA",

                  fontFamily:
                    "Raleway_500Medium",

                  fontSize:
                    8.8,
                }}
              >
                or
              </Text>

              <View
                style={{
                  flex: 1,

                  height:
                    1,

                  backgroundColor:
                    BORDER,
                }}
              />
            </View>

            {/* =================================================
                CONTINUE AS GUEST
                ================================================= */}

            <View
              style={{
                alignItems:
                  "center",
              }}
            >
              <Pressable
                onPress={() =>
                  router.replace(
                    "/"
                  )
                }

                style={({
                  pressed,
                }) => ({
                  width:
                    "68%",

                  minHeight:
                    compact
                      ? 42
                      : 44,

                  marginTop:
                    compact
                      ? 9
                      : 11,

                  borderRadius:
                    14,

                  backgroundColor:
                    SOFT_PURPLE,

                  alignItems:
                    "center",

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

                    fontSize:
                      10.5,
                  }}
                >
                  Continue as Guest
                </Text>
              </Pressable>

              <Text
                style={{
                  maxWidth:
                    300,

                  marginTop:
                    6,

                  paddingHorizontal:
                    12,

                  color:
                    "#A69DAA",

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize:
                    8.4,

                  lineHeight:
                    12,

                  textAlign:
                    "center",
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