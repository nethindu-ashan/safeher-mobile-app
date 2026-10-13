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
  StyleSheet,
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
   FIXED HERO IMAGE
   Same image is used for all three languages
   ============================================================ */

const HERO_IMAGE = require(
  "../../assets/images/auth/login-hero-1.png"
);


const HERO_LOGO = require(
  "../../assets/images/logo/color-logo.png"
);

/* ============================================================
   HERO TEXTS
   Only text changes every 5 seconds
   ============================================================ */

const heroMessages = [
  {
    language: "english",
    text: "Every woman deserves a safe journey.",
  },
  {
    language: "sinhala",
    text: "ඔබේ සුරක්ෂිතභාවය, අපගේ වගකීමයි.",
  },
  {
    language: "tamil",
    text: "ஒவ்வொரு பெண்ணுக்கும் பாதுகாப்பான பயணம் உரியது.",
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
  const { height } = useWindowDimensions();

  const compact = height < 780;

  const heroHeight = compact ? 278 : 313;
  const inputHeight = compact ? 47 : 50;

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
     TEXT SLIDESHOW
     Image does NOT change
     ========================================================== */

  const [currentSlide, setCurrentSlide] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (current) =>
          (current + 1) % heroMessages.length
      );
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const activeHero =
    heroMessages[currentSlide];

  /* ==========================================================
     FORM STATE
     ========================================================== */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [emailFocused, setEmailFocused] =
    useState(false);

  const [
    passwordFocused,
    setPasswordFocused,
  ] = useState(false);

  /* ==========================================================
     VALIDATION
     ========================================================== */

  const validateForm = () => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    Alert.alert(
      "Missing email",
      "Please enter your email address."
    );
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    Alert.alert(
      "Invalid email",
      "Please enter a valid email address."
    );
    return false;
  }

  if (password.length === 0) {
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

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = await signIn({
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
        profileResponse.data.role;

      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/");
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

  const getHeroTextStyle = () => {
    /* English */

    if (
      activeHero.language ===
      "english"
    ) {
      return {
        fontFamily:
          "Raleway_700Bold",

        fontSize:
          compact ? 21 : 23,

        lineHeight:
          compact ? 26 : 28,

        letterSpacing: -0.2,
      };
    }

    /* Sinhala */

    if (
      activeHero.language ===
      "sinhala"
    ) {
      return {
        fontFamily:
          "NotoSansSinhala_800ExtraBold",

        fontSize:
          compact ? 19 : 21,

        lineHeight:
          compact ? 28 : 31,

        letterSpacing: 0,
      };
    }

    /* Tamil */

    return {
      fontFamily:
        "NotoSansTamil_600SemiBold",

      fontSize:
        compact ? 17 : 19,

      lineHeight:
        compact ? 27 : 30,

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
          backgroundColor: BACKGROUND,
        }}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.primaryDark
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom:
              compact ? 10 : 14,
          }}
        >
          {/* ==================================================
              HERO
              ================================================== */}

          <View
            style={[
              styles.heroContainer,
              {
                height: heroHeight,
              },
            ]}
          >
            {/* ================================================
                FIXED IMAGE
                Always login-hero-1.png
                ================================================ */}

            <Image
              source={HERO_IMAGE}
              resizeMode="cover"
              style={styles.heroImage}
            />

            {/* ================================================
                STRONG LEFT PINK FADE
                Increased strength + width
                ================================================ */}

      <LinearGradient
  pointerEvents="none"
  colors={[
    "rgba(255,255,255,0.95)",
    "rgba(255,235,247,0.92)",
    "rgba(255,205,235,0.86)",
    "rgba(248,175,230,0.72)",
    "rgba(238,170,255,0.48)",
    "rgba(238,170,255,0.22)",
    "rgba(238,170,255,0.00)",
  ]}
  locations={[
    0,
    0.18,
    0.34,
    0.48,
    0.60,
    0.70,
    0.80,
  ]}
  start={{
    x: 0,
    y: 0.5,
  }}
  end={{
    x: 1,
    y: 0.5,
  }}
  style={styles.leftGradient}
/>

            {/* ================================================
                EXTRA TOP-LEFT SOFT FADE
                ================================================ */}

          <LinearGradient
  pointerEvents="none"
  colors={[
    "rgba(255,245,250,0.55)",
    "rgba(255,205,235,0.52)",
    "rgba(245,175,235,0.42)",
    "rgba(238,170,255,0.00)",
  ]}
  locations={[
    0,
    0.20,
    0.38,
    0.55,
  ]}
  start={{
    x: 0,
    y: 0,
  }}
  end={{
    x: 0.72,
    y: 1,
  }}
  style={styles.topLeftGradient}
/>

            {/* ================================================
                HERO CONTENT
                ================================================ */}

            <View
              style={styles.heroContent}
            >
              {/* BACK BUTTON */}

              <Pressable
                onPress={() =>
                  router.back()
                }
                hitSlop={10}
                style={({ pressed }) => [
                  styles.backButton,
                  {
                    opacity:
                      pressed
                        ? 0.65
                        : 1,
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={19}
                  color="#FFFFFF"
                />
              </Pressable>

              {/* HERO TEXT */}

              <View
                style={styles.heroTextArea}
              >
                <View
  style={
    styles.heroTextContainer
  }
>
  {/* SAFEHER LOGO */}
  <Image
    source={HERO_LOGO}
    resizeMode="contain"
    style={styles.heroLogo}
  />

  {/* TRANSLATED HERO TEXT */}
  <Text
    style={[
      {
        color: HERO_TEXT,
      },

      getHeroTextStyle(),
    ]}
  >
    {activeHero.text}
  </Text>

                  {/* TEXT LANGUAGE INDICATOR */}

                  <View
                    style={
                      styles.heroDots
                    }
                  >
                    {heroMessages.map(
                      (_, index) => {
                        const active =
                          currentSlide ===
                          index;

                        return (
                          <View
                            key={index}
                            style={{
                              width:
                                active
                                  ? 11
                                  : 5,

                              height: 5,

                              marginRight: 5,

                              borderRadius: 3,

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
            style={[
              styles.form,
              {
                paddingTop:
                  compact
                    ? 24
                    : 28,
              },
            ]}
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

                letterSpacing: -0.3,
              }}
            >
              Welcome back
            </Text>

            <Text
              style={styles.subtitle}
            >
              Sign in to continue to your
              SafeHer account.
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
                style={styles.label}
              >
                Email address
              </Text>

              <View
                style={[
                  styles.inputContainer,

                  {
                    height:
                      inputHeight,

                    borderColor:
                      emailFocused
                        ? COLORS.primary
                        : BORDER,
                  },
                ]}
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
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  style={
                    styles.input
                  }
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
                style={styles.label}
              >
                Password
              </Text>

              <View
                style={[
                  styles.inputContainer,

                  {
                    height:
                      inputHeight,

                    borderColor:
                      passwordFocused
                        ? COLORS.primary
                        : BORDER,
                  },
                ]}
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
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  style={
                    styles.input
                  }
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
                    color={MUTED}
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
                  paddingVertical: 3,

                  opacity:
                    pressed
                      ? 0.65
                      : 1,
                })}
              >
                <Text
                  style={
                    styles.forgotText
                  }
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
              disabled={loading}
              style={({
                pressed,
              }) => ({
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
                    compact
                      ? 49
                      : 52,

                  borderRadius: 16,

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
                    style={
                      styles.signInText
                    }
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
                style={
                  styles.accountText
                }
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
                  style={
                    styles.createAccountText
                  }
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
                style={
                  styles.divider
                }
              />

              <Text
                style={
                  styles.orText
                }
              >
                or
              </Text>

              <View
                style={
                  styles.divider
                }
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
                  width: "68%",

                  minHeight:
                    compact
                      ? 42
                      : 44,

                  marginTop:
                    compact
                      ? 9
                      : 11,

                  borderRadius: 14,

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
                  style={
                    styles.guestText
                  }
                >
                  Continue as Guest
                </Text>
              </Pressable>

              <Text
                style={
                  styles.guestDescription
                }
              >
                Emergency safety features
                remain available without an
                account.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  /* HERO */

  heroContainer: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  heroImage: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    width: "100%",
    height: "100%",

    opacity: 1,
  },

  /*
   * Main horizontal fade.
   *
   * Original width was about 58%.
   * Increased to 78% so the fade reaches further
   * into the image and the left side is much clearer
   * behind the translated text.
   */

  leftGradient: {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "100%",
},

topLeftGradient: {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
},

  heroContent: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },

  backButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(60,8,108,0.72)",
  },

  heroTextArea: {
    flex: 1,
    justifyContent: "flex-end",
  },

  heroTextContainer: {
    width: "58%",
  },

  heroDots: {
    marginTop: 12,

    flexDirection: "row",
    alignItems: "center",
  },

  /* FORM */

  form: {
    paddingHorizontal: 24,
  },

  subtitle: {
    marginTop: 3,

    color: MUTED,

    fontFamily:
      "Raleway_400Regular",

    fontSize: 11,
    lineHeight: 15,
  },

  label: {
    marginBottom: 5,

    color: COLORS.text,

    fontFamily:
      "Raleway_600SemiBold",

    fontSize: 11.3,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,

    borderWidth: 1.2,
    borderRadius: 15,

    backgroundColor:
      INPUT_BACKGROUND,
  },

  input: {
    flex: 1,
    height: "100%",

    marginLeft: 10,

    color: COLORS.text,

    fontFamily:
      "Raleway_500Medium",

    fontSize: 12.3,
  },

  forgotText: {
    color: COLORS.primary,

    fontFamily:
      "Raleway_700Bold",

    fontSize: 10.8,
  },

  signInText: {
    color: "#FFFFFF",

    fontFamily:
      "Raleway_700Bold",

    fontSize: 13,
  },

  accountText: {
    color: MUTED,

    fontFamily:
      "Raleway_400Regular",

    fontSize: 10.5,
  },

  createAccountText: {
    color: COLORS.primary,

    fontFamily:
      "Raleway_700Bold",

    fontSize: 10.5,
  },

  divider: {
    flex: 1,
    height: 1,

    backgroundColor: BORDER,
  },

  orText: {
    marginHorizontal: 10,

    color: "#A69DAA",

    fontFamily:
      "Raleway_500Medium",

    fontSize: 8.8,
  },

  guestText: {
    color: COLORS.primary,

    fontFamily:
      "Raleway_700Bold",

    fontSize: 10.5,
  },

  guestDescription: {
    maxWidth: 300,

    marginTop: 6,
    paddingHorizontal: 12,

    color: "#A69DAA",

    fontFamily:
      "Raleway_400Regular",

    fontSize: 8.4,
    lineHeight: 12,

    textAlign: "center",
  },


  heroLogo: {
  width: 105,
  height: 42,
  marginBottom: 10,
  alignSelf: "flex-start",
},
});