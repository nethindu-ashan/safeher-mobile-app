import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AppInput from "../../src/components/AppInput";
import PrimaryButton from "../../src/components/PrimaryButton";
import ScreenHeader from "../../src/components/ScreenHeader";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  pickIncidentEvidence,
} from "../../src/services/evidenceService";

const categories = [
  "Harassment",
  "Suspicious Activity",
  "Unsafe Area",
  "Other",
];

export default function ReportIncidentScreen() {
  const {
    draft,
    updateDraft,
  } = useIncidentReport();

  const hasLocation =
    draft.latitude !== null &&
    draft.longitude !== null;

  const handleAddEvidence =
    async () => {
      try {
        const selected =
          await pickIncidentEvidence(
            draft.evidence.length
          );

        if (
          selected.length === 0
        ) {
          return;
        }

        updateDraft({
          evidence: [
            ...draft.evidence,
            ...selected,
          ],
        });
      } catch (error) {
        Alert.alert(
          "Evidence",
          error instanceof Error
            ? error.message
            : "Unable to select photos."
        );
      }
    };

  const removeEvidence = (
    index: number
  ) => {
    updateDraft({
      evidence:
        draft.evidence.filter(
          (
            _,
            itemIndex
          ) =>
            itemIndex !==
            index
        ),
    });
  };

  const handleContinue = () => {
    if (!draft.category) {
      Alert.alert(
        "Missing Information",
        "Please select an incident category."
      );
      return;
    }

    if (
      !draft.description.trim()
    ) {
      Alert.alert(
        "Missing Information",
        "Please enter a description."
      );
      return;
    }

    if (!hasLocation) {
      router.push(
        "/report/select-location"
      );
      return;
    }

    router.push(
      "/report/review"
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <ScreenHeader title="Report an Incident" />

        <Text className="mt-3 text-sm font-medium text-app-text">
          Incident Type
        </Text>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {categories.map(
            (category) => {
              const selected =
                draft.category ===
                category;

              return (
                <Pressable
                  key={
                    category
                  }
                  onPress={() =>
                    updateDraft({
                      category,
                    })
                  }
                  className={
                    selected
                      ? "rounded-full bg-light-purple px-4 py-3"
                      : "rounded-full border border-app-border bg-white px-4 py-3"
                  }
                >
                  <Text
                    className={
                      selected
                        ? "font-medium text-primary"
                        : "text-app-muted"
                    }
                  >
                    {
                      category
                    }
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        <View className="mt-6">
          <AppInput
            label="Description"
            placeholder="Describe what happened"
            multiline
            numberOfLines={5}
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
          />
        </View>

        <View className="mt-6">
          <Text className="text-sm font-semibold text-app-text">
            Incident Evidence
          </Text>

          <Text className="mt-1 text-xs leading-5 text-app-muted">
            Add up to 3
            optional photos
            that may help
            administrators
            review your report.
          </Text>

          <Pressable
            onPress={
              handleAddEvidence
            }
            disabled={
              draft.evidence
                .length >= 3
            }
            className="mt-3 flex-row items-center justify-center rounded-2xl border border-app-border bg-white py-4 active:opacity-75"
          >
            <Ionicons
              name="images-outline"
              size={21}
              color={
                draft.evidence
                  .length >= 3
                  ? COLORS.textSecondary
                  : COLORS.primary
              }
            />

            <Text
              className={
                draft.evidence
                  .length >= 3
                  ? "ml-2 font-semibold text-app-muted"
                  : "ml-2 font-semibold text-primary"
              }
            >
              {draft.evidence
                .length >= 3
                ? "Maximum 3 Photos"
                : "Add Photos"}
            </Text>
          </Pressable>

          {draft.evidence
            .length > 0 && (
            <>
              <View className="mt-4 flex-row flex-wrap gap-3">
                {draft.evidence.map(
                  (
                    item,
                    index
                  ) => (
                    <View
                      key={`${item.uri}-${index}`}
                      className="relative"
                    >
                      <Image
                        source={{
                          uri:
                            item.uri,
                        }}
                        style={{
                          width: 92,
                          height: 92,
                          borderRadius:
                            16,
                        }}
                      />

                      <Pressable
                        onPress={() =>
                          removeEvidence(
                            index
                          )
                        }
                        style={{
                          backgroundColor:
                            COLORS.error,
                        }}
                        className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full"
                      >
                        <Ionicons
                          name="close"
                          size={17}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    </View>
                  )
                )}
              </View>

              <Text className="mt-3 text-xs text-app-muted">
                {
                  draft
                    .evidence
                    .length
                }
                /3 photos
                selected
              </Text>
            </>
          )}
        </View>

        <View className="mt-6 rounded-2xl border border-app-border bg-white p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-semibold text-app-text">
                Report
                Anonymously
              </Text>

              <Text className="mt-1 text-xs leading-4 text-app-muted">
                Your personal
                profile will not
                be publicly
                linked to this
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
                  "#D1D5DB",
                true:
                  COLORS.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {hasLocation && (
          <View className="mt-4 rounded-2xl bg-light-purple p-4">
            <Text className="font-semibold text-primary">
              Location
              Selected
            </Text>

            <Text className="mt-1 text-sm text-app-muted">
              {draft.latitude?.toFixed(
                6
              )}
              ,{" "}
              {draft.longitude?.toFixed(
                6
              )}
            </Text>

            <Pressable
              onPress={() =>
                router.push(
                  "/report/select-location"
                )
              }
            >
              <Text className="mt-2 font-medium text-primary">
                Change
                Location
              </Text>
            </Pressable>
          </View>
        )}

        <View className="mt-8">
          <PrimaryButton
            title={
              hasLocation
                ? "Review Report"
                : "Select Location"
            }
            onPress={
              handleContinue
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}