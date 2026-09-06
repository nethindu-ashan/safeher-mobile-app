import { router } from "expo-router";

import {
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

  const handleContinue = () => {
    if (!draft.category) {
      alert("Please select an incident category.");
      return;
    }

    if (!draft.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!hasLocation) {
      router.push("/report/select-location");
      return;
    }

    router.push("/report/review");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <ScreenHeader title="Report an Incident" />

        <Text className="mt-3 text-sm font-medium text-app-text">
          Incident Type
        </Text>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {categories.map((category) => {
            const selected =
              draft.category === category;

            return (
              <Pressable
                key={category}
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
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-6">
          <AppInput
            label="Description"
            placeholder="Describe what happened"
            multiline
            numberOfLines={5}
            value={draft.description}
            onChangeText={(description) =>
              updateDraft({
                description,
              })
            }
          />
        </View>

        <View className="mt-3 rounded-2xl border border-app-border bg-white p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-semibold text-app-text">
                Report Anonymously
              </Text>

              <Text className="mt-1 text-xs leading-4 text-app-muted">
                Your personal profile will not be linked
                to this report.
              </Text>
            </View>

            <Switch
              value={draft.isAnonymous}
              onValueChange={(isAnonymous) =>
                updateDraft({
                  isAnonymous,
                })
              }
              trackColor={{
                false: "#D1D5DB",
                true: COLORS.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {hasLocation && (
          <View className="mt-4 rounded-2xl bg-light-purple p-4">
            <Text className="font-semibold text-primary">
              Location Selected
            </Text>

            <Text className="mt-1 text-sm text-app-muted">
              {draft.latitude?.toFixed(6)},{" "}
              {draft.longitude?.toFixed(6)}
            </Text>

            <Pressable
              onPress={() =>
                router.push("/report/select-location")
              }
            >
              <Text className="mt-2 font-medium text-primary">
                Change Location
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
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}