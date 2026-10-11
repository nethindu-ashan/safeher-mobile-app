import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  COLORS,
} from "../../src/constants/theme";

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND = "#FFFBFD";

const SUCCESS = "#168447";

const SUCCESS_SOFT = "#EAF7EE";

/* ============================================================
   SCREEN
   ============================================================ */

export default function SOSCancelledScreen() {
  const { height } =
    useWindowDimensions();

  const compact =
    height < 780;

  /* ==========================================================
     BACK HOME
     ========================================================== */

  const goHome = () => {
    router.replace("/");
  };

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <SafeAreaView
      edges={[
        "top",
        "bottom",
      ]}
      className="flex-1"
      style={{
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

      {/* ==================================================
          CONTENT
          ================================================== */}

      <View className="flex-1 px-5">
        <View className="flex-1 items-center justify-center">
          {/* ==================================================
              ICON
              ================================================== */}

          <View className="h-[104px] w-[104px] items-center justify-center rounded-full bg-[#F3FBF5]">
            <View
              className="h-[78px] w-[78px] items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  SUCCESS_SOFT,
              }}
            >
              <Ionicons
                name="checkmark"
                size={37}
                color={
                  SUCCESS
                }
              />
            </View>
          </View>

          {/* ==================================================
              TITLE
              ================================================== */}

          <Text className="mt-7 text-center text-[22px] font-bold leading-[28px] text-app-text">
            SOS Cancelled
          </Text>

          {/* ==================================================
              DESCRIPTION
              ================================================== */}

          <Text className="mt-2 max-w-[290px] text-center text-[10.5px] leading-[17px] text-app-muted">
            Your emergency SOS is no
            longer active.
          </Text>

          {/* ==================================================
              STATUS CARD
              ================================================== */}

          <View className="mt-7 w-full flex-row items-center rounded-[17px] border border-app-border bg-white px-4 py-4">
            <View
              className="h-10 w-10 items-center justify-center rounded-[12px]"
              style={{
                backgroundColor:
                  SUCCESS_SOFT,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={
                  SUCCESS
                }
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[9px] text-app-muted">
                SOS status
              </Text>

              <Text
                className="mt-1 text-[11px] font-semibold"
                style={{
                  color:
                    SUCCESS,
                }}
              >
                Cancelled
              </Text>
            </View>
          </View>

          {/* ==================================================
              SMALL MESSAGE
              ================================================== */}

          <View className="mt-4 w-full flex-row items-start rounded-[16px] bg-light-purple px-4 py-3.5">
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2.5 flex-1 text-[9.5px] leading-[15px] text-app-muted">
              If you need emergency
              assistance again, you can
              activate SOS anytime from
              the Home screen.
            </Text>
          </View>
        </View>
      </View>

      {/* ==================================================
          BOTTOM ACTION
          ================================================== */}

      <View
        className="border-t border-[#EDE6F0] bg-white px-5"
        style={{
          paddingTop: 12,

          paddingBottom:
            compact
              ? 8
              : 10,
        }}
      >
        <Pressable
          onPress={
            goHome
          }
          style={({
            pressed,
          }) => ({
            borderRadius:
              16,

            overflow:
              "hidden",

            opacity:
              pressed
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
            <Text className="text-[13px] font-bold text-white">
              Back to Home
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}