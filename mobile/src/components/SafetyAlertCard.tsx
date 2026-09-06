import { Pressable, Text, View } from "react-native";

import AppCard from "./AppCard";

type Incident = {
  id: string;
  category: string;
  description?: string;
  latitude: number;
  longitude: number;
  incidentDatetime: string;
  createdAt: string;
  status: string;
  distance: number;
 
};

type Props = {
  incident: Incident;
  onPress: () => void;
};

export default function SafetyAlertCard({
  incident,
  onPress,
}: Props) {
  const distance =
    incident.distance < 1
      ? `${Math.round(incident.distance * 1000)} m away`
      : `${incident.distance.toFixed(1)} km away`;

  const incidentDate = new Date(incident.incidentDatetime);
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - incidentDate.getTime()) / 60000)
  );
  const relativeTime =
  elapsedMinutes < 1
    ? "Just now"
    : elapsedMinutes < 60
      ? `${elapsedMinutes} min ago`
      : elapsedMinutes < 1440
        ? `${Math.floor(elapsedMinutes / 60)} hr ago`
        : `${Math.floor(elapsedMinutes / 1440)} day${
            Math.floor(elapsedMinutes / 1440) === 1 ? "" : "s"
          } ago`;

  const categoryStyle = incident.category.toLowerCase().includes("light")
    ? { backgroundColor: "#FFF2C7", color: "#F59E0B" }
    : incident.category.toLowerCase().includes("construct")
      ? { backgroundColor: "#F2E8FF", color: "#9333EA" }
      : incident.category.toLowerCase().includes("walk")
        ? { backgroundColor: "#D7F7F0", color: "#0F9F8C" }
        : { backgroundColor: "#FFE8EE", color: "#EF3340" };

  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-70"
    >
      <AppCard>
        <View className="flex-row items-center justify-between">
          <View
            className="rounded-md px-2.5 py-1"
            style={{ backgroundColor: categoryStyle.backgroundColor }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: categoryStyle.color }}
            >
              {incident.category}
            </Text>
          </View>
          <Text className="text-xs text-app-muted">{relativeTime}</Text>
        </View>

        <Text className="mt-3 text-base font-bold text-app-text">
          {distance}
        </Text>

        <Text className="mt-1 text-sm leading-5 text-app-muted">
          {incident.description || `${distance} from your current location.`}
        </Text>
      </AppCard>
    </Pressable>
  );
}