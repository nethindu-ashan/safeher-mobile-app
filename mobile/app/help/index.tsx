import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryCard from "../../src/components/CategoryCard";
import LocationCard from "../../src/components/LocationCard";
import NearbyHelpHeader from "../../src/components/NearbyHelpHeader";
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
        <NearbyHelpHeader />

        <LocationCard />

        <Text className="mt-7 mb-1 text-lg font-bold text-app-text">
          What help do you need?
        </Text>
        <Text className="mb-4 text-sm leading-5 text-app-muted">
          Quick access to trusted services near your current location.
        </Text>

        <View>
          {NEARBY_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.type}
              index={index}
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