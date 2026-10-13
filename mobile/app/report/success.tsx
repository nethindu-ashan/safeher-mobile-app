import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

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

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND = "#FFFBFD";
const SUCCESS = "#16844A";
const SUCCESS_BG = "#EAF7EE";

/* ============================================================
   SCREEN
   ============================================================ */

export default function ReportSuccessScreen() {
  const { height } =
    useWindowDimensions();

  const compact =
    height < 780;

  const {
    id,
    status,
  } = useLocalSearchParams();

  const {
    resetDraft,
  } = useIncidentReport();

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  const goHome = () => {
    resetDraft();

    router.replace("/");
  };

  const goReports = () => {
    resetDraft();

    router.replace(
      "/reports"
    );
  };

  /* ==========================================================
     STATUS LABEL
     ========================================================== */

  const statusText =
    status
      ? String(status)
          .replace(/_/g, " ")
          .replace(
            /\b\w/g,
            (letter) =>
              letter.toUpperCase()
          )
      : "Submitted";

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
          MAIN CONTENT
          ================================================== */}

      <View className="flex-1 px-5">
        <View className="flex-1 items-center justify-center">
          {/* ==================================================
              SUCCESS ICON
              ================================================== */}

          <View className="h-[104px] w-[104px] items-center justify-center rounded-full bg-[#F3FBF5]">
            <View
              className="h-[78px] w-[78px] items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  SUCCESS_BG,
              }}
            >
              <Ionicons
                name="checkmark"
                size={38}
                color={
                  SUCCESS
                }
              />
            </View>
          </View>

          {/* ==================================================
              SUCCESS MESSAGE
              ================================================== */}

          <Text className="mt-7 text-center text-[22px] font-bold leading-[28px] text-app-text">
            Report Submitted
          </Text>

          <Text className="mt-2 max-w-[300px] text-center text-[11px] leading-[17px] text-app-muted">
            Thank you for helping
            make the community safer.
            Your report has been
            received successfully.
          </Text>

          {/* ==================================================
              REPORT DETAILS
              ================================================== */}

          {(id || status) && (
            <View className="mt-7 w-full overflow-hidden rounded-[18px] border border-app-border bg-white">
              {/* REPORT ID */}

              {id && (
                <View className="flex-row items-center px-4 py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-light-purple">
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-[9px] text-app-muted">
                      Report ID
                    </Text>

                    <Text
                      className="mt-1 text-[11px] font-semibold text-app-text"
                      numberOfLines={1}
                    >
                      {String(id)}
                    </Text>
                  </View>
                </View>
              )}

              {/* DIVIDER */}

              {id && status && (
                <View className="ml-[68px] h-px bg-[#F0EBF2]" />
              )}

              {/* STATUS */}

              {status && (
                <View className="flex-row items-center px-4 py-4">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-[12px]"
                    style={{
                      backgroundColor:
                        SUCCESS_BG,
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={19}
                      color={
                        SUCCESS
                      }
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-[9px] text-app-muted">
                      Status
                    </Text>

                    <View className="mt-1 flex-row items-center">
                      <View
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            SUCCESS,
                        }}
                      />

                      <Text
                        className="ml-2 text-[11px] font-semibold"
                        style={{
                          color:
                            SUCCESS,
                        }}
                      >
                        {
                          statusText
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ==================================================
              SMALL INFO
              ================================================== */}

          <View className="mt-5 w-full flex-row items-start rounded-[16px] bg-light-purple px-4 py-3.5">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2.5 flex-1 text-[9.5px] leading-[15px] text-app-muted">
              You can check the
              progress of your report
              anytime from My Reports.
            </Text>
          </View>
        </View>
      </View>

      {/* ==================================================
          BOTTOM ACTIONS
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
        {/* ==================================================
            PRIMARY - BACK HOME
            ================================================== */}

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

        {/* ==================================================
            SECONDARY - VIEW REPORTS
            ================================================== */}

        <Pressable
          onPress={
            goReports
          }
          style={({
            pressed,
          }) => ({
            opacity:
              pressed
                ? 0.7
                : 1,
          })}
          className="mt-2.5 h-[48px] flex-row items-center justify-center rounded-[16px] border border-[#DED5E4] bg-white"
        >
          <Ionicons
            name="document-text-outline"
            size={17}
            color={
              COLORS.primary
            }
          />

          <Text className="ml-2 text-[12px] font-semibold text-primary">
            View My Reports
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}