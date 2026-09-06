import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import PrimaryButton from "../../src/components/PrimaryButton";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  COLORS,
} from "../../src/constants/theme";

export default function ReportSuccessScreen() {
  const {
    id,
    status,
  } = useLocalSearchParams();

  const {
    resetDraft,
  } = useIncidentReport();

  const goHome = () => {
    resetDraft();

    router.replace("/");
  };

  const goReports = () => {
    resetDraft();

    router.replace("/reports");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
          <Ionicons
            name="checkmark"
            size={38}
            color={COLORS.primary}
          />
        </View>

        <Text className="mt-7 text-center text-2xl font-bold text-app-text">
          Report Submitted Successfully
        </Text>

        <Text className="mt-3 text-center leading-5 text-app-muted">
          Thank you for helping keep our community safe.
        </Text>

        {id && (
          <View className="mt-6 rounded-xl bg-light-purple px-5 py-3">
            <Text className="text-xs text-app-muted">
              REPORT ID
            </Text>

            <Text className="mt-1 font-semibold text-primary">
              {String(id)}
            </Text>
          </View>
        )}

        {status && (
          <Text className="mt-4 text-sm text-app-muted">
            Status: {String(status)}
          </Text>
        )}

        <View className="mt-10 w-full">
          <PrimaryButton
            title="Back to Home"
            onPress={goHome}
          />
        </View>

        <Pressable
          onPress={goReports}
          className="mt-4"
        >
          <Text className="font-semibold text-primary">
            View My Reports
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}