import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { useState } from "react";

import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  createIncident,
} from "../../src/services/incidentService";

import {
  uploadIncidentEvidence,
} from "../../src/services/evidenceService";

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND =
  "#FFFBFD";

/* ============================================================
   SCREEN
   ============================================================ */

export default function ReviewIncidentScreen() {
  const { height } =
    useWindowDimensions();

  const compact =
    height < 780;

  const {
    draft,
  } = useIncidentReport();

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* ==========================================================
     SUBMIT REPORT
     ========================================================== */

  const handleSubmit =
    async () => {
      if (
        draft.latitude === null ||
        draft.longitude === null
      ) {
        Alert.alert(
          "Location Required",
          "Please select an incident location."
        );

        router.push(
          "/report/select-location"
        );

        return;
      }

      try {
        setSubmitting(true);

        const evidencePaths =
          draft.evidence.length > 0
            ? await uploadIncidentEvidence(
                draft.evidence
              )
            : [];

        console.log(
          "MOBILE EVIDENCE PATHS:",
          evidencePaths
        );

        const response =
          await createIncident({
            category:
              draft.category,

            latitude:
              draft.latitude,

            longitude:
              draft.longitude,

            dateTime:
              draft.dateTime,

            description:
              draft.description,

            isAnonymous:
              draft.isAnonymous,

            evidencePaths,
          });

        console.log(
          "INCIDENT CREATE RESPONSE:",
          response
        );

        router.replace({
          pathname:
            "/report/success",

          params: {
            id:
              response.data.id,

            status:
              response.data.status,
          },
        });
      } catch (error) {
        console.error(
          "Report submission error:",
          error
        );

        Alert.alert(
          "Submission Failed",
          error instanceof Error
            ? error.message
            : "Unable to submit your report."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /* ==========================================================
     EDIT REPORT
     ========================================================== */

  const handleEditReport =
    () => {
      if (submitting) {
        return;
      }

      /*
       * Always go directly to
       * Report Incident.
       *
       * Draft data stays in context,
       * including the selected location.
       */

      router.replace(
        "/report"
      );
    };

  /* ==========================================================
     CHANGE LOCATION
     ========================================================== */

  const handleChangeLocation =
    () => {
      if (submitting) {
        return;
      }

      router.push(
        "/report/select-location"
      );
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
          HEADER
          ================================================== */}

      <View className="px-5">
        <ScreenHeader
          title="Review Your Report"
        />

        <Text className="-mt-1 mb-5 text-[11px] leading-[17px] text-app-muted">
          Check your information
          before submitting.
        </Text>
      </View>

      {/* ==================================================
          CONTENT
          ================================================== */}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 26,
        }}
      >
        {/* =================================================
            SUMMARY TITLE
            ================================================= */}

        <View className="mb-3">
          <Text className="text-[15px] font-bold text-app-text">
            Report summary
          </Text>

          <Text className="mt-1 text-[10px] leading-[15px] text-app-muted">
            Make sure these details
            are correct.
          </Text>
        </View>

        {/* =================================================
            MAIN SUMMARY
            ================================================= */}

        <View className="overflow-hidden rounded-[18px] border border-app-border bg-white">
          {/* INCIDENT TYPE */}

          <View className="flex-row items-center px-4 py-4">
            <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-light-purple">
              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[9px] text-app-muted">
                Incident type
              </Text>

              <Text className="mt-1 text-[12px] font-semibold text-app-text">
                {draft.category}
              </Text>
            </View>
          </View>

          <View className="ml-[68px] h-px bg-[#F0EBF2]" />

          {/* DESCRIPTION */}

          <View className="flex-row items-start px-4 py-4">
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
                What happened
              </Text>

              <Text className="mt-1.5 text-[11px] leading-[17px] text-app-text">
                {draft.description}
              </Text>
            </View>
          </View>

          <View className="ml-[68px] h-px bg-[#F0EBF2]" />

          {/* LOCATION */}

          <View className="flex-row items-center px-4 py-4">
            <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-light-purple">
              <Ionicons
                name="location-outline"
                size={19}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[9px] text-app-muted">
                Incident location
              </Text>

              <Text className="mt-1 text-[11px] font-semibold text-app-text">
                Location selected
              </Text>

              {draft.latitude !== null &&
                draft.longitude !== null && (
                  <Text className="mt-1 text-[8.5px] text-app-muted">
                    {draft.latitude.toFixed(
                      5
                    )}
                    ,{" "}
                    {draft.longitude.toFixed(
                      5
                    )}
                  </Text>
                )}
            </View>

            <Pressable
              onPress={
                handleChangeLocation
              }
              disabled={
                submitting
              }
              hitSlop={8}
              className="rounded-[10px] bg-[#F5F0FF] px-3 py-2 active:opacity-70"
            >
              <Text className="text-[9.5px] font-semibold text-primary">
                Change
              </Text>
            </Pressable>
          </View>

          <View className="ml-[68px] h-px bg-[#F0EBF2]" />

          {/* SUBMISSION */}

          <View className="flex-row items-center px-4 py-4">
            <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFF0F6]">
              <Ionicons
                name={
                  draft.isAnonymous
                    ? "eye-off-outline"
                    : "person-outline"
                }
                size={19}
                color={
                  COLORS.pink
                }
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[9px] text-app-muted">
                Submission
              </Text>

              <Text className="mt-1 text-[11px] font-semibold text-app-text">
                {draft.isAnonymous
                  ? "Anonymous report"
                  : "Report with profile"}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            PHOTOS
            ================================================= */}

        <View className="mt-7">
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center">
                <Text className="text-[15px] font-bold text-app-text">
                  Photos
                </Text>

                <Text className="ml-2 text-[9px] text-app-muted">
                  Optional
                </Text>
              </View>

              <Text className="mt-1 text-[10px] text-app-muted">
                Evidence added to
                this report.
              </Text>
            </View>

            <View className="rounded-full bg-[#F5F1F7] px-2.5 py-1.5">
              <Text className="text-[9px] font-semibold text-app-muted">
                {draft.evidence.length}/3
              </Text>
            </View>
          </View>

          {draft.evidence.length ===
          0 ? (
            <View className="mt-3 flex-row items-center rounded-[16px] border border-app-border bg-white px-4 py-3.5">
              <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-[#F7F4F8]">
                <Ionicons
                  name="images-outline"
                  size={18}
                  color="#807783"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[11px] font-semibold text-app-text">
                  No photos added
                </Text>

                <Text className="mt-0.5 text-[9px] text-app-muted">
                  Photos are optional.
                </Text>
              </View>
            </View>
          ) : (
            <View className="mt-4 flex-row flex-wrap">
              {draft.evidence.map(
                (
                  item,
                  index
                ) => (
                  <Image
                    key={`${item.uri}-${index}`}
                    source={{
                      uri:
                        item.uri,
                    }}
                    className="mb-3 mr-3 h-[82px] w-[82px] rounded-[14px] bg-light-purple"
                  />
                )
              )}
            </View>
          )}
        </View>

        {/* =================================================
            PRIVACY
            ================================================= */}

        <View className="mt-5 flex-row items-start rounded-[16px] bg-light-purple px-4 py-3.5">
          <View className="mt-0.5">
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={
                COLORS.primary
              }
            />
          </View>

          <View className="ml-2.5 flex-1">
            <Text className="text-[10.5px] font-semibold text-app-text">
              Your privacy matters
            </Text>

            <Text className="mt-1 text-[9.5px] leading-[15px] text-app-muted">
              Evidence photos are
              stored privately and
              are not shown in the
              public nearby incident
              feed.
            </Text>
          </View>
        </View>
      </ScrollView>

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
        {/* EDIT REPORT */}

        <Pressable
          onPress={
            handleEditReport
          }
          disabled={
            submitting
          }
          style={({
            pressed,
          }) => ({
            opacity:
              submitting
                ? 0.45
                : pressed
                ? 0.7
                : 1,
          })}
          className="h-[48px] flex-row items-center justify-center rounded-[16px] border border-[#DED5E4] bg-white"
        >
          <Ionicons
            name="create-outline"
            size={17}
            color={
              COLORS.primary
            }
          />

          <Text className="ml-2 text-[12px] font-semibold text-primary">
            Edit Report
          </Text>
        </Pressable>

        {/* SUBMIT REPORT */}

        <Pressable
          onPress={
            handleSubmit
          }
          disabled={
            submitting
          }
          className="mt-2.5"
          style={({
            pressed,
          }) => ({
            borderRadius:
              16,

            overflow:
              "hidden",

            opacity:
              submitting
                ? 0.72
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
            {submitting ? (
              <View className="flex-row items-center">
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text className="ml-2 text-[13px] font-bold text-white">
                  Submitting...
                </Text>
              </View>
            ) : (
              <Text className="text-[13px] font-bold text-white">
                Submit Report
              </Text>
            )}
          </LinearGradient>
        </Pressable>

        <Text className="mt-2 text-center text-[9px] leading-[13px] text-app-muted">
          Submit only after checking
          that the information is
          correct.
        </Text>
      </View>
    </SafeAreaView>
  );
}