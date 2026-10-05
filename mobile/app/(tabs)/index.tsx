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

import {
  ComponentProps,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Easing,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { getMyProfile } from "../../src/services/userService";

type IconName =
  ComponentProps<typeof Ionicons>["name"];

type QuickActionProps = {
  title: string;
  subtitle: string;
  icon: IconName;
  tone?: "purple" | "pink";
  onPress: () => void;
};

const morningBanner = require(
  "../../assets/images/home/morning-banner.png"
);

const afternoonBanner = require(
  "../../assets/images/home/afternoon-banner.png"
);

const nightBanner = require(
  "../../assets/images/home/night-banner.png"
);

const safetyBanner = require(
  "../../assets/images/home/safety-banner.png"
);

const BACKGROUND = "#FFFBFD";
const WHITE = "#FFFFFF";
const BORDER = "#EAE4ED";

const PURPLE_SOFT = "#F5F0FF";
const PINK_SOFT = "#FFF0F5";

const SOS_RED = "#D92D20";
const SOS_RING = "#F97066";

function getBannerData() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      image: morningBanner,
      greeting: "Good Morning",
      message: "Start your day with a safer journey.",
    };
  }

  if (hour >= 12 && hour < 18) {
    return {
      image: afternoonBanner,
      greeting: "Good Afternoon",
      message: "Stay aware and travel with confidence.",
    };
  }

  if (hour >= 18 && hour < 22) {
    return {
      image: nightBanner,
      greeting: "Good Evening",
      message: "Stay connected on your journey home.",
    };
  }

  return {
    image: nightBanner,
    greeting: "Good Night",
    message: "Stay alert. Help is always within reach.",
  };
}

function QuickAction({
  title,
  subtitle,
  icon,
  tone = "purple",
  onPress,
}: QuickActionProps) {
  const isPink = tone === "pink";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: "48%",
        height: 108,
        marginBottom: 12,
        padding: 14,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,

        backgroundColor: WHITE,

        opacity: pressed ? 0.72 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,

            alignItems: "center",
            justifyContent: "center",

            backgroundColor: isPink
              ? PINK_SOFT
              : PURPLE_SOFT,
          }}
        >
          <Ionicons
            name={icon}
            size={18}
            color={
              isPink
                ? COLORS.pink
                : COLORS.primary
            }
          />
        </View>

        <Ionicons
          name="arrow-up-outline"
          size={14}
          color="#B1A8B5"
          style={{
            transform: [
              {
                rotate: "45deg",
              },
            ],
          }}
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 10,

          color: COLORS.text,

          fontFamily:
            "Raleway_700Bold",

          fontSize: 12.3,
        }}
      >
        {title}
      </Text>

      <Text
        numberOfLines={2}
        style={{
          marginTop: 3,

          color:
            COLORS.textSecondary,

          fontFamily:
            "Raleway_400Regular",

          fontSize: 9.4,
          lineHeight: 13,
        }}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
  });

  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  const [
    fullName,
    setFullName,
  ] =
    useState<string | null>(
      null
    );

  const [
    banner,
    setBanner,
  ] =
    useState(
      getBannerData()
    );

  const pulse =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            pulse,
            {
              toValue: 1.17,
              duration: 900,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            pulse,
            {
              toValue: 1,
              duration: 900,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),
        ])
      );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  useEffect(() => {
    const updateBanner =
      () => {
        setBanner(
          getBannerData()
        );
      };

    updateBanner();

    const timer =
      setInterval(
        updateBanner,
        60000
      );

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFullName(null);
      return;
    }

    async function loadProfile() {
      try {
        const response =
          await getMyProfile();

        setFullName(
          response.data.fullName
        );
      } catch (error) {
        console.log(
          "Unable to load Home profile:",
          error
        );

        const metadataName =
          user?.user_metadata
            ?.full_name;

        if (
          typeof metadataName ===
            "string" &&
          metadataName.trim()
        ) {
          setFullName(
            metadataName.trim()
          );
        }
      }
    }

    loadProfile();
  }, [
    isAuthenticated,
    user?.id,
  ]);

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

  const firstName =
    fullName
      ?.trim()
      .split(" ")[0] ||
    "";

  const openContacts =
    () => {
      if (isAuthenticated) {
        router.push(
          "/trusted-contacts"
        );
      } else {
        router.push(
          "/auth/sign-in"
        );
      }
    };

  const openReports =
    () => {
      if (isAuthenticated) {
        router.push(
          "/(tabs)/reports"
        );
      } else {
        router.push(
          "/auth/sign-in"
        );
      }
    };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor:
          COLORS.primaryDark,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.primaryDark
        }
      />

      <View
        style={{
          flex: 1,
          backgroundColor:
            BACKGROUND,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 34,
          }}
        >
          <ImageBackground
            source={banner.image}
            resizeMode="cover"
            style={{
              width: "100%",
              height: 94,
            }}
          >
            <LinearGradient
              colors={[
                "rgba(73,25,160,0.88)",
                "rgba(117,39,209,0.58)",
                "rgba(126,45,214,0.18)",
                "rgba(0,0,0,0.02)",
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

                justifyContent:
                  "center",

                paddingHorizontal: 26,
              }}
            >
              <View
                style={{
                  width: "56%",
                }}
              >
                <Text
                  style={{
                    color:
                      "#FFFFFF",

                    fontFamily:
                      "Raleway_800ExtraBold",

                    fontSize: 18,
                    lineHeight: 21,
                  }}
                >
                  {banner.greeting}
                </Text>

                {isAuthenticated &&
                  !loading &&
                  firstName && (
                    <Text
                      style={{
                        marginTop: 1,

                        color:
                          "#FFFFFF",

                        fontFamily:
                          "Raleway_700Bold",

                        fontSize: 10.5,
                      }}
                    >
                      {firstName}
                    </Text>
                  )}

                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: 4,

                    maxWidth: 165,

                    color:
                      "rgba(255,255,255,0.92)",

                    fontFamily:
                      "Raleway_500Medium",

                    fontSize: 8.8,
                    lineHeight: 12,
                  }}
                >
                  {banner.message}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>

          <View
            style={{
              paddingHorizontal: 26,
            }}
          >
            <View
              style={{
                alignItems: "center",

                paddingTop: 23,
              }}
            >
              <Text
                style={{
                  color:
                    COLORS.text,

                  fontFamily:
                    "Raleway_800ExtraBold",

                  fontSize: 19,

                  textAlign:
                    "center",
                }}
              >
                Emergency SOS
              </Text>

              <Text
                style={{
                  marginTop: 4,

                  color:
                    COLORS.textSecondary,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize: 10.3,

                  textAlign:
                    "center",
                }}
              >
                Immediate help when every second matters
              </Text>

              <View
                style={{
                  width: 174,
                  height: 174,

                  marginTop: 5,

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position:
                      "absolute",

                    width: 126,
                    height: 126,

                    borderRadius: 63,

                    borderWidth: 3,
                    borderColor:
                      SOS_RING,

                    backgroundColor:
                      "transparent",

                    transform: [
                      {
                        scale:
                          pulse,
                      },
                    ],
                  }}
                />

                <View
                  pointerEvents="none"
                  style={{
                    position:
                      "absolute",

                    width: 128,
                    height: 128,

                    borderRadius: 64,

                    borderWidth: 1,
                    borderColor:
                      "#FECACA",

                    backgroundColor:
                      "transparent",
                  }}
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Emergency SOS"
                  onPress={() =>
                    router.push(
                      "/report/sos-countdown"
                    )
                  }
                  style={({ pressed }) => ({
                    width: 108,
                    height: 108,

                    borderRadius: 54,

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    elevation: 12,

                    shadowColor:
                      "#7F1D1D",

                    shadowOpacity: 0.3,

                    shadowRadius: 10,

                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },

                    transform: [
                      {
                        scale:
                          pressed
                            ? 0.96
                            : 1,
                      },
                    ],
                  })}
                >
                  <View
                    style={{
                      width: 108,
                      height: 108,

                      borderRadius: 54,

                      backgroundColor:
                        SOS_RED,

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >
                    <Ionicons
                      name="warning-outline"
                      size={28}
                      color="#FFFFFF"
                    />

                    <Text
                      style={{
                        marginTop: 3,

                        color:
                          "#FFFFFF",

                        fontFamily:
                          "Raleway_800ExtraBold",

                        fontSize: 20,
                      }}
                    >
                      SOS
                    </Text>
                  </View>
                </Pressable>
              </View>

              <View
                style={{
                  marginTop: -7,

                  paddingHorizontal: 12,
                  paddingVertical: 6,

                  borderRadius: 999,

                  backgroundColor:
                    "#FFF1F0",
                }}
              >
                <Text
                  style={{
                    color:
                      "#B42318",

                    fontFamily:
                      "Raleway_600SemiBold",

                    fontSize: 9.3,
                  }}
                >
                  Tap to start 3-second emergency countdown
                </Text>
              </View>
            </View>

            {!isAuthenticated &&
              !loading && (
                <View
                  style={{
                    marginTop: 22,

                    padding: 13,

                    borderRadius: 17,

                    borderWidth: 1,
                    borderColor:
                      BORDER,

                    backgroundColor:
                      WHITE,

                    flexDirection:
                      "row",

                    alignItems:
                      "center",
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,

                      borderRadius: 12,

                      backgroundColor:
                        PURPLE_SOFT,

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,

                      marginLeft: 11,
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          COLORS.text,

                        fontFamily:
                          "Raleway_700Bold",

                        fontSize: 11,
                      }}
                    >
                      You're using SafeHer as a guest
                    </Text>

                    <Text
                      numberOfLines={2}
                      style={{
                        marginTop: 2,

                        color:
                          COLORS.textSecondary,

                        fontFamily:
                          "Raleway_400Regular",

                        fontSize: 9.1,
                        lineHeight: 13,
                      }}
                    >
                      Sign in to save contacts and track reports.
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/auth/sign-in"
                      )
                    }
                    style={({ pressed }) => ({
                      height: 34,

                      paddingHorizontal: 13,

                      borderRadius: 11,

                      backgroundColor:
                        pressed
                          ? COLORS.primaryDark
                          : COLORS.primary,

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    })}
                  >
                    <Text
                      style={{
                        color:
                          "#FFFFFF",

                        fontFamily:
                          "Raleway_700Bold",

                        fontSize: 9.5,
                      }}
                    >
                      Sign In
                    </Text>
                  </Pressable>
                </View>
              )}

            <View
              style={{
                marginTop: 28,
              }}
            >
              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "flex-end",

                  justifyContent:
                    "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      color:
                        COLORS.text,

                      fontFamily:
                        "Raleway_700Bold",

                      fontSize: 16.5,
                    }}
                  >
                    Plan your journey
                  </Text>

                  <Text
                    style={{
                      marginTop: 2,

                      color:
                        COLORS.textSecondary,

                      fontFamily:
                        "Raleway_400Regular",

                      fontSize: 10,
                    }}
                  >
                    Check before you travel
                  </Text>
                </View>

                <Text
                  style={{
                    color:
                      COLORS.primary,

                    fontFamily:
                      "Raleway_600SemiBold",

                    fontSize: 9.5,
                  }}
                >
                  Safer travel
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push(
                    "/route"
                  )
                }
                style={({ pressed }) => ({
                  marginTop: 11,

                  borderRadius: 18,

                  overflow:
                    "hidden",

                  opacity:
                    pressed
                      ? 0.82
                      : 1,
                })}
              >
                <LinearGradient
                  colors={[
                    "#7137E8",
                    "#A13FE5",
                    "#EC4D95",
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
                    height: 72,

                    paddingHorizontal: 15,

                    flexDirection:
                      "row",

                    alignItems:
                      "center",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,

                      borderRadius: 13,

                      backgroundColor:
                        "rgba(255,255,255,0.17)",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >
                    <Ionicons
                      name="navigate-outline"
                      size={19}
                      color="#FFFFFF"
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,

                      marginLeft: 12,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "#FFFFFF",

                        fontFamily:
                          "Raleway_700Bold",

                        fontSize: 13,
                      }}
                    >
                      Plan a Safer Route
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        marginTop: 2,

                        color:
                          "rgba(255,255,255,0.84)",

                        fontFamily:
                          "Raleway_400Regular",

                        fontSize: 9.2,
                      }}
                    >
                      Compare route options before travelling
                    </Text>
                  </View>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </Pressable>
            </View>

            <ImageBackground
              source={safetyBanner}
              resizeMode="cover"
              imageStyle={{
                borderRadius: 20,
              }}
              style={{
                height: 112,

                marginTop: 26,

                overflow:
                  "hidden",

                borderRadius: 20,
              }}
            >
              <LinearGradient
                colors={[
                  "rgba(54,15,138,0.88)",
                  "rgba(108,34,195,0.58)",
                  "rgba(50,20,80,0.10)",
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

                  paddingHorizontal: 17,

                  justifyContent:
                    "center",
                }}
              >
                <View
                  style={{
                    width: "62%",
                  }}
                >
                  <Text
                    style={{
                      color:
                        "#FFFFFF",

                      fontFamily:
                        "Raleway_800ExtraBold",

                      fontSize: 15,
                      lineHeight: 19,
                    }}
                  >
                    Stay connected.
                  </Text>

                  <Text
                    style={{
                      color:
                        "#FFFFFF",

                      fontFamily:
                        "Raleway_800ExtraBold",

                      fontSize: 15,
                      lineHeight: 19,
                    }}
                  >
                    Travel with confidence.
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={{
                      marginTop: 5,

                      color:
                        "rgba(255,255,255,0.86)",

                      fontFamily:
                        "Raleway_400Regular",

                      fontSize: 8.8,
                      lineHeight: 12,
                    }}
                  >
                    Keep your route and safety tools ready before every journey.
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>

            <View
              style={{
                marginTop: 27,
              }}
            >
              <Text
                style={{
                  color:
                    COLORS.text,

                  fontFamily:
                    "Raleway_700Bold",

                  fontSize: 16.5,
                }}
              >
                Quick Help
              </Text>

              <Text
                style={{
                  marginTop: 3,

                  color:
                    COLORS.textSecondary,

                  fontFamily:
                    "Raleway_400Regular",

                  fontSize: 10,
                }}
              >
                Essential safety tools
              </Text>

              <View
                style={{
                  marginTop: 12,

                  flexDirection:
                    "row",

                  flexWrap:
                    "wrap",

                  justifyContent:
                    "space-between",
                }}
              >
                <QuickAction
                  title="Report Incident"
                  subtitle="Report a safety concern"
                  icon="document-text-outline"
                  tone="pink"
                  onPress={() =>
                    router.push(
                      "/report"
                    )
                  }
                />

                <QuickAction
                  title="Nearby Help"
                  subtitle="Find nearby support"
                  icon="location-outline"
                  onPress={() =>
                    router.push(
                      "/help"
                    )
                  }
                />

                <QuickAction
                  title="Trusted Contacts"
                  subtitle={
                    isAuthenticated
                      ? "Manage emergency contacts"
                      : "Sign in to manage contacts"
                  }
                  icon="people-outline"
                  onPress={
                    openContacts
                  }
                />

                <QuickAction
                  title="Safety Alerts"
                  subtitle="Check nearby alerts"
                  icon="notifications-outline"
                  tone="pink"
                  onPress={() =>
                    router.push(
                      "/(tabs)/alerts"
                    )
                  }
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 14,
              }}
            >
              <Text
                style={{
                  marginBottom: 11,

                  color:
                    COLORS.text,

                  fontFamily:
                    "Raleway_700Bold",

                  fontSize: 16.5,
                }}
              >
                Your Activity
              </Text>

              <Pressable
                onPress={
                  openReports
                }
                style={({ pressed }) => ({
                  minHeight: 68,

                  paddingHorizontal: 14,

                  borderRadius: 17,

                  borderWidth: 1,
                  borderColor:
                    BORDER,

                  backgroundColor:
                    WHITE,

                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  opacity:
                    pressed
                      ? 0.72
                      : 1,
                })}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,

                    borderRadius: 12,

                    backgroundColor:
                      PURPLE_SOFT,

                    alignItems:
                      "center",

                    justifyContent:
                      "center",
                  }}
                >
                  <Ionicons
                    name={
                      isAuthenticated
                        ? "folder-open-outline"
                        : "lock-closed-outline"
                    }
                    size={18}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <View
                  style={{
                    flex: 1,

                    marginLeft: 12,
                  }}
                >
                  <Text
                    style={{
                      color:
                        COLORS.text,

                      fontFamily:
                        "Raleway_700Bold",

                      fontSize: 12.5,
                    }}
                  >
                    My Reports
                  </Text>

                  <Text
                    style={{
                      marginTop: 3,

                      color:
                        COLORS.textSecondary,

                      fontFamily:
                        "Raleway_400Regular",

                      fontSize: 9.5,
                    }}
                  >
                    {isAuthenticated
                      ? "View and track submitted reports"
                      : "Sign in to access your reports"}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color="#AAA0B0"
                />
              </Pressable>
            </View>

            <View
              style={{
                marginTop: 17,

                paddingHorizontal: 13,
                paddingVertical: 11,

                borderRadius: 16,

                backgroundColor:
                  PURPLE_SOFT,

                flexDirection:
                  "row",

                alignItems:
                  "center",
              }}
            >
              <View
                style={{
                  width: 31,
                  height: 31,

                  borderRadius: 10,

                  backgroundColor:
                    WHITE,

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <Text
                style={{
                  flex: 1,

                  marginLeft: 10,

                  color:
                    COLORS.textSecondary,

                  fontFamily:
                    "Raleway_500Medium",

                  fontSize: 9.5,
                  lineHeight: 14,
                }}
              >
                Stay aware of your surroundings and keep your route and trusted contacts ready.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}