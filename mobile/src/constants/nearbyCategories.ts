import type { ComponentProps } from "react";

import type { NearbyHelpCategory } from "../types/nearbyHelp";

export type NearbyCategoryIcon = ComponentProps<
  typeof import("@expo/vector-icons").Ionicons
>["name"];

export type NearbyCategory = {
  type: NearbyHelpCategory;
  title: string;
  description: string;
  icon: NearbyCategoryIcon;
};

export const NEARBY_CATEGORIES: NearbyCategory[] = [
  {
    type: "POLICE",
    title: "Police Stations",
    description: "Immediate safety assistance",
    icon: "shield-checkmark-outline",
  },
  {
    type: "HOSPITAL",
    title: "Hospitals",
    description: "Medical emergency support",
    icon: "medkit-outline",
  },
  {
    type: "PHARMACY",
    title: "Pharmacies",
    description: "Medicine and first aid",
    icon: "medical-outline",
  },
  {
    type: "CLINIC",
    title: "Clinics",
    description: "Doctors and medical clinics",
    icon: "heart-outline",
  },
  {
    type: "FIRE_STATION",
    title: "Fire Stations",
    description: "Emergency response",
    icon: "flame-outline",
  },
];

export function getNearbyCategory(
  value: string | undefined
): NearbyCategory | undefined {
  return NEARBY_CATEGORIES.find(
    (category) => category.type === value?.toUpperCase()
  );
}