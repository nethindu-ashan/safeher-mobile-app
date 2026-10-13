import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  ComponentProps,
   useRef,
  useState,
} from "react";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  pickIncidentEvidence,
} from "../../src/services/evidenceService";

/* ============================================================
   TYPES
   ============================================================ */

type IconName =
  ComponentProps<typeof Ionicons>["name"];

type IncidentOption = {
  value: string;
  title: string;
  icon: IconName;
};

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND =
  "#FFFBFD";

const ERROR =
  COLORS.error ?? "#D64545";

/* ============================================================
   INCIDENT TYPES
   ============================================================ */

const INCIDENT_TYPES: IncidentOption[] = [
  {
    value: "Harassment",
    title: "Harassment",
    icon: "hand-left-outline",
  },
  {
    value: "Suspicious Activity",
    title: "Suspicious Activity",
    icon: "eye-outline",
  },
  {
    value: "Unsafe Area",
    title: "Unsafe Area",
    icon: "location-outline",
  },
  {
    value: "Other",
    title: "Other",
    icon: "ellipsis-horizontal-outline",
  },
];

/* ============================================================
   SCREEN
   ============================================================ */

export default function ReportIncidentScreen() {
  const { height } =
    useWindowDimensions();

  const compact =
    height < 780;

  /* ==========================================================
     CONTEXT
     ========================================================== */

  const {
    draft,
    updateDraft,
  } = useIncidentReport();

  /* ==========================================================
     STATE
     ========================================================== */

  const [
    showErrors,
    setShowErrors,
  ] = useState(false);

  const [
    descriptionFocused,
    setDescriptionFocused,
  ] = useState(false);

  const isPickingEvidence = useRef(false);

  /* ==========================================================
     VALUES
     ========================================================== */

  const evidenceCount =
    draft.evidence.length;

  const evidenceLimitReached =
    evidenceCount >= 3;

  const descriptionLength =
    draft.description.length;

  const hasLocation =
    draft.latitude !== null &&
    draft.longitude !== null;

  const categoryError =
    showErrors &&
    !draft.category;

  const descriptionError =
    showErrors &&
    !draft.description.trim();

  /* ==========================================================
     ADD PHOTOS
     ========================================================== */

  const handleAddEvidence = async () => {
  if (evidenceLimitReached || isPickingEvidence.current) {
    return;
  }

  isPickingEvidence.current = true;

  try {
    const selected = await pickIncidentEvidence(evidenceCount);

    if (selected.length === 0) {
      return;
    }

    // Never exceed the three-photo limit.
    const remainingSlots = Math.max(0, 3 - evidenceCount);
    const evidenceToAdd = selected.slice(0, remainingSlots);

    if (evidenceToAdd.length === 0) {
      return;
    }

    updateDraft({
      evidence: [...draft.evidence, ...evidenceToAdd],
    });
  } catch (error) {
    Alert.alert(
      "Unable to add photos",
      error instanceof Error
        ? error.message
        : "Please try again."
    );
  } finally {
    isPickingEvidence.current = false;
  }
};

  /* ==========================================================
     REMOVE PHOTO
     ========================================================== */

  const removeEvidence = (
    index: number
  ) => {
    updateDraft({
      evidence:
        draft.evidence.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    });
  };

  /* ==========================================================
     CONTINUE
     ========================================================== */

  const handleContinue = () => {
  const cleanDescription = draft.description.trim();

  // Validate incident type.
  if (!draft.category) {
    setShowErrors(true);
    return;
  }

  // Validate description.
  if (!cleanDescription) {
    setShowErrors(true);
    return;
  }

  setShowErrors(false);

  // If coordinates exist, make sure they are valid.
  if (hasLocation) {
    const { latitude, longitude } = draft;

    const validCoordinates =
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;

    if (!validCoordinates) {
      Alert.alert(
        "Invalid location",
        "Please select a valid location before reviewing your report.",
        [
          {
            text: "Select location",
            onPress: () => router.push("/report/select-location"),
          },
        ]
      );

      return;
    }

    router.push("/report/review");
    return;
  }

  // Location has not been selected yet.
  router.push("/report/select-location");
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

      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <View className="px-5">
          <ScreenHeader
            title="Report Incident"
          />

          <Text className="-mt-1 mb-5 text-[11px] leading-[17px] text-app-muted">
            Share a few details about
            what happened.
          </Text>
        </View>

        {/* ==================================================
            FORM
            ================================================== */}

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 28,
          }}
        >
          {/* =================================================
              INCIDENT TYPE
              ================================================= */}

          <View className="mb-7">
            <View className="flex-row items-center">
              <Text className="text-[15px] font-bold text-app-text">
                Incident type
              </Text>

              <Text className="ml-1 text-[13px] font-bold text-[#D34A61]">
                *
              </Text>
            </View>

            <Text className="mt-1 text-[10px] leading-[15px] text-app-muted">
              Select one option.
            </Text>

            {/* INCIDENT GRID */}

            <View className="mt-4 flex-row flex-wrap justify-between">
              {INCIDENT_TYPES.map(
                (item) => {
                  const selected =
                    draft.category ===
                    item.value;

                  return (
                    <Pressable
                      key={
                        item.value
                      }
                      onPress={() => {
                        updateDraft({
                          category:
                            item.value,
                        });
                      }}
                      className={`mb-3 w-[48.5%] flex-row items-center rounded-[16px] border px-3 py-3.5 active:opacity-80 ${
                        selected
                          ? "border-primary bg-[#F8F3FF]"
                          : "border-app-border bg-white"
                      }`}
                      style={{
                        minHeight: 64,
                      }}
                    >
                      {/* ICON */}

                      <View
                        className={`h-9 w-9 items-center justify-center rounded-[12px] ${
                          selected
                            ? "bg-[#EEE5FF]"
                            : "bg-[#F7F4F8]"
                        }`}
                      >
                        <Ionicons
                          name={
                            item.icon
                          }
                          size={18}
                          color={
                            selected
                              ? COLORS.primary
                              : "#756D7A"
                          }
                        />
                      </View>

                      {/* TITLE */}

                      <Text
                        className={`ml-2.5 flex-1 text-[10.5px] font-semibold leading-[14px] ${
                          selected
                            ? "text-primary"
                            : "text-app-text"
                        }`}
                        numberOfLines={
                          2
                        }
                      >
                        {
                          item.title
                        }
                      </Text>

                      {/* SELECTED */}

                      {selected && (
                        <View className="ml-1 h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </Pressable>
                  );
                }
              )}
            </View>

            {/* ERROR */}

            {categoryError && (
              <View className="mt-1 flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={ERROR}
                />

                <Text className="ml-1.5 text-[10px] font-medium text-[#C73F48]">
                  Please select an
                  incident type.
                </Text>
              </View>
            )}
          </View>

          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <View className="mb-7">
            <View className="flex-row items-center">
              <Text className="text-[15px] font-bold text-app-text">
                What happened?
              </Text>

              <Text className="ml-1 text-[13px] font-bold text-[#D34A61]">
                *
              </Text>
            </View>

            <Text className="mt-1 text-[10px] leading-[15px] text-app-muted">
              Briefly describe what
              you saw or experienced.
            </Text>

            <View
              className={`mt-3 overflow-hidden rounded-[16px] border bg-white ${
                descriptionError
                  ? "border-[#D64545]"
                  : descriptionFocused
                  ? "border-primary"
                  : "border-app-border"
              }`}
            >
              <TextInput
                value={
                  draft.description
                }
                onChangeText={(
                  description
                ) =>
                  updateDraft({
                    description,
                  })
                }
                onFocus={() =>
                  setDescriptionFocused(
                    true
                  )
                }
                onBlur={() =>
                  setDescriptionFocused(
                    false
                  )
                }
                placeholder="Describe what happened..."
                placeholderTextColor="#AAA2AE"
                multiline
                maxLength={500}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect
                className="min-h-[115px] px-4 pb-2 pt-4 text-[12px] leading-[18px] text-app-text"
              />

              <View className="items-end px-4 pb-3">
                <Text className="text-[9px] text-[#AAA1AE]">
                  {
                    descriptionLength
                  }
                  /500
                </Text>
              </View>
            </View>

            {/* ERROR */}

            {descriptionError && (
              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={ERROR}
                />

                <Text className="ml-1.5 text-[10px] font-medium text-[#C73F48]">
                  Please add a short
                  description.
                </Text>
              </View>
            )}
          </View>

          {/* =================================================
              PHOTOS
              ================================================= */}

          <View className="mb-7">
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
                  Add up to 3 photos.
                </Text>
              </View>

              <Text className="text-[10px] font-semibold text-app-muted">
                {evidenceCount}/3
              </Text>
            </View>

            {/* ADD PHOTO */}

            {!evidenceLimitReached && (
              <Pressable
                onPress={
                  handleAddEvidence
                }
                className="mt-3 flex-row items-center rounded-[16px] border border-app-border bg-white px-4 py-3.5 active:opacity-75"
              >
                <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-light-purple">
                  <Ionicons
                    name="camera-outline"
                    size={19}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-[11px] font-semibold text-app-text">
                    {evidenceCount === 0
                      ? "Add photos"
                      : "Add another photo"}
                  </Text>

                  <Text className="mt-0.5 text-[9px] text-app-muted">
                    Choose from your
                    device
                  </Text>
                </View>

                <Ionicons
                  name="add"
                  size={20}
                  color={
                    COLORS.primary
                  }
                />
              </Pressable>
            )}

            {/* PHOTO PREVIEWS */}

            {evidenceCount > 0 && (
              <View className="mt-3 flex-row flex-wrap">
                {draft.evidence.map(
                  (
                    item,
                    index
                  ) => (
                    <View
                      key={`${item.uri}-${index}`}
                      className="relative mb-3 mr-3"
                    >
                      <Image
                        source={{
                          uri:
                            item.uri,
                        }}
                        className="h-[78px] w-[78px] rounded-[14px] bg-light-purple"
                      />

                      <Pressable
                        onPress={() =>
                          removeEvidence(
                            index
                          )
                        }
                        hitSlop={7}
                        className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#D64545]"
                      >
                        <Ionicons
                          name="close"
                          size={13}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    </View>
                  )
                )}
              </View>
            )}
          </View>

          {/* =================================================
              ANONYMOUS
              ================================================= */}

          <View className="mb-2 flex-row items-center rounded-[16px] border border-app-border bg-white px-4 py-4">
            <View className="flex-1 pr-3">
              <Text className="text-[12px] font-semibold text-app-text">
                Report anonymously
              </Text>

              <Text className="mt-1 text-[9.5px] leading-[14px] text-app-muted">
                Keep your identity
                private with this
                report.
              </Text>
            </View>

            <Switch
              value={
                draft.isAnonymous
              }
              onValueChange={(
                isAnonymous
              ) =>
                updateDraft({
                  isAnonymous,
                })
              }
              trackColor={{
                false:
                  "#DDD8E0",

                true:
                  COLORS.primary,
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDD8E0"
            />
          </View>
        </ScrollView>

        {/* ==================================================
            BOTTOM CTA
            ================================================== */}

        <View
          className="border-t border-[#EDE6F0] bg-white px-5"
          style={{
            paddingTop: 11,

            paddingBottom:
              compact
                ? 8
                : 10,
          }}
        >
          <Pressable
            onPress={
              handleContinue
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
              {/* IMPORTANT DYNAMIC LABEL */}

              <Text className="text-[13px] font-bold text-white">
                {hasLocation
                  ? "Continue to Review"
                  : "Continue to Location"}
              </Text>
            </LinearGradient>
          </Pressable>

          <Text className="mt-2 text-center text-[9px] text-app-muted">
            {hasLocation
              ? "Review your updated details before submitting."
              : "You can review your report before submitting."}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}