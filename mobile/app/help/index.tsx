import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryCard from "../../src/components/CategoryCard";
import ScreenHeader from "../../src/components/ScreenHeader";
import { NEARBY_CATEGORIES } from "../../src/constants/nearbyCategories";
import { COLORS } from "../../src/constants/theme";

export default function NearbyHelpScreen() {
  const handleEmergencySOS = () => {
    router.push("/report/sos");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <ScreenHeader title="Nearby Help Services" />

        <Text className="mt-1 text-sm leading-5 text-app-muted">
          Find trusted safety services near your current location.
        </Text>

        <View className="mt-5 flex-row items-start rounded-2xl border border-app-border bg-white p-4">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-light-purple">
            <Ionicons
              name="location-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-app-text">
              Location is requested when you choose a service
            </Text>
            <Text className="mt-1 text-xs leading-4 text-app-muted">
              We use your current GPS position to find nearby places.
            </Text>
          </View>
        </View>

        <Text className="mt-7 text-lg font-bold text-app-text">
          What help do you need?
        </Text>

        <View className="mt-4">
          {NEARBY_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.type}
              category={category}
              onPress={() =>
                router.push({
                  pathname: "/help/list",
                  params: {
                    type: category.type,
                    title: category.title,
                  },
                })
              }
            />
          ))}
        </View>

        <View className="mt-4 rounded-2xl bg-sos-light p-4">
          <View className="flex-row items-start">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
              <Ionicons
                name="alert-outline"
                size={22}
                color={COLORS.sos}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-app-text">
                Need Emergency Help?
              </Text>
              <Text className="mt-1 text-xs leading-4 text-app-muted">
                Open SafeHer Emergency SOS for immediate assistance.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleEmergencySOS}
            className="mt-4 flex-row items-center justify-center rounded-full bg-sos py-4 active:opacity-80"
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text className="ml-2 font-semibold text-white">
              Emergency SOS
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}