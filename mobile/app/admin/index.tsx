import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";
import {
  ComponentProps,
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";

import {
  AdminIncident,
  IncidentStatus,
  getAdminIncidents,
} from "../../src/services/adminService";

import {
  AdminSOS,
  getAdminSOSRecords,
} from "../../src/services/adminSosService";

type IconName =
  ComponentProps<
    typeof Ionicons
  >["name"];

interface StatusCardProps {
  title: string;
  count: number;
  icon: IconName;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}

function StatusCard({
  title,
  count,
  icon,
  iconColor,
  backgroundColor,
  onPress,
}: StatusCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 w-[48%] rounded-3xl border border-app-border bg-white p-5 active:opacity-75"
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
        }}
      >
        <Ionicons
          name={icon}
          size={23}
          color={iconColor}
        />
      </View>

      <Text className="mt-4 text-3xl font-bold text-app-text">
        {count}
      </Text>

      <Text className="mt-1 text-sm font-semibold text-app-muted">
        {title}
      </Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const [incidents, setIncidents] =
    useState<AdminIncident[]>([]);

  const [sosRecords, setSOSRecords] =
    useState<AdminSOS[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          incidentResponse,
          sosResponse,
        ] = await Promise.all([
          getAdminIncidents(),
          getAdminSOSRecords(),
        ]);

        setIncidents(
          Array.isArray(
            incidentResponse.data
          )
            ? incidentResponse.data
            : []
        );

        setSOSRecords(
          Array.isArray(
            sosResponse.data
          )
            ? sosResponse.data
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load admin dashboard:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const pendingCount =
    incidents.filter(
      (item) =>
        item.status ===
        "Pending Review"
    ).length;

  const verifiedCount =
    incidents.filter(
      (item) =>
        item.status ===
        "Verified"
    ).length;

  const rejectedCount =
    incidents.filter(
      (item) =>
        item.status ===
        "Rejected"
    ).length;

  const cancelledCount =
    incidents.filter(
      (item) =>
        item.status ===
        "Cancelled"
    ).length;

  const activeSOSCount =
    sosRecords.filter(
      (item) =>
        item.status === "ACTIVE"
    ).length;

  const cancelledSOSCount =
    sosRecords.filter(
      (item) =>
        item.status === "CANCELLED"
    ).length;

  const openReports = (
    status?: IncidentStatus
  ) => {
    if (status) {
      router.push({
        pathname:
          "/admin/reports",
        params: {
          status,
        },
      });

      return;
    }

    router.push(
      "/admin/reports"
    );
  };

  const openSOS = (
    status?:
      | "ACTIVE"
      | "CANCELLED"
  ) => {
    if (status) {
      router.push({
        pathname: "/admin/sos",
        params: {
          status,
        },
      });

      return;
    }

    router.push(
      "/admin/sos"
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
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        <View className="mt-2">
          <Text className="text-2xl font-bold text-app-text">
            Admin Dashboard
          </Text>

          <Text className="mt-1 text-sm text-app-muted">
            SafeHer safety management
          </Text>
        </View>

        <View className="mt-6 rounded-3xl bg-light-purple p-5">
          <View className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Ionicons
                name="shield-checkmark-outline"
                size={28}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-app-text">
                Safety Administration
              </Text>

              <Text className="mt-1 text-sm leading-5 text-app-muted">
                Review incident reports and monitor emergency SOS events.
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-7 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-app-text">
            Report Overview
          </Text>

          {!loading && (
            <Pressable
              onPress={
                loadDashboard
              }
            >
              <Ionicons
                name="refresh-outline"
                size={22}
                color={
                  COLORS.primary
                }
              />
            </Pressable>
          )}
        </View>

        {loading ? (
          <View className="mt-16 items-center">
            <ActivityIndicator
              size="large"
              color={
                COLORS.primary
              }
            />

            <Text className="mt-3 text-app-muted">
              Loading dashboard...
            </Text>
          </View>
        ) : error ? (
          <View className="mt-12 items-center rounded-3xl border border-app-border bg-white p-6">
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={
                COLORS.error
              }
            />

            <Text className="mt-4 text-lg font-bold text-app-text">
              Unable to load dashboard
            </Text>

            <Text className="mt-2 text-center text-app-muted">
              {error}
            </Text>

            <Pressable
              onPress={
                loadDashboard
              }
              className="mt-5 rounded-2xl bg-primary px-6 py-3"
            >
              <Text className="font-bold text-white">
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View className="mt-4 flex-row flex-wrap justify-between">
              <StatusCard
                title="Pending"
                count={
                  pendingCount
                }
                icon="time-outline"
                iconColor="#E59B16"
                backgroundColor="#FFF7E7"
                onPress={() =>
                  openReports(
                    "Pending Review"
                  )
                }
              />

              <StatusCard
                title="Verified"
                count={
                  verifiedCount
                }
                icon="checkmark-circle-outline"
                iconColor={
                  COLORS.success
                }
                backgroundColor="#ECFDF5"
                onPress={() =>
                  openReports(
                    "Verified"
                  )
                }
              />

              <StatusCard
                title="Rejected"
                count={
                  rejectedCount
                }
                icon="close-circle-outline"
                iconColor={
                  COLORS.error
                }
                backgroundColor="#FEF2F2"
                onPress={() =>
                  openReports(
                    "Rejected"
                  )
                }
              />

              <StatusCard
                title="Cancelled"
                count={
                  cancelledCount
                }
                icon="ban-outline"
                iconColor={
                  COLORS.textSecondary
                }
                backgroundColor="#F5F3F6"
                onPress={() =>
                  openReports(
                    "Cancelled"
                  )
                }
              />
            </View>

            <Pressable
              onPress={() =>
                openReports()
              }
              className="mt-1 flex-row items-center rounded-3xl border border-app-border bg-white p-5 active:opacity-75"
            >
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-light-purple">
                <Ionicons
                  name="documents-outline"
                  size={23}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-base font-bold text-app-text">
                  All Reports
                </Text>

                <Text className="mt-1 text-sm text-app-muted">
                  {incidents.length} total submitted reports
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#A995B5"
              />
            </Pressable>

            {pendingCount >
              0 && (
              <Pressable
                onPress={() =>
                  openReports(
                    "Pending Review"
                  )
                }
                className="mt-4 flex-row items-center rounded-3xl border border-app-border bg-white p-5 active:opacity-75"
              >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7E7]">
                  <Ionicons
                    name="clipboard-outline"
                    size={23}
                    color="#E59B16"
                  />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-base font-bold text-app-text">
                    Review Pending Reports
                  </Text>

                  <Text className="mt-1 text-sm text-app-muted">
                    {pendingCount} waiting for administrator review
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#A995B5"
                />
              </Pressable>
            )}

            <View className="mt-9 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-app-text">
                Emergency SOS
              </Text>

              <Ionicons
                name="warning-outline"
                size={22}
                color={
                  COLORS.sos
                }
              />
            </View>

            <Text className="mt-1 text-sm leading-5 text-app-muted">
              View emergency SOS events recorded by SafeHer users.
            </Text>

            <View className="mt-4 flex-row flex-wrap justify-between">
              <StatusCard
                title="Active SOS"
                count={
                  activeSOSCount
                }
                icon="warning-outline"
                iconColor={
                  COLORS.sos
                }
                backgroundColor="#FFE9EB"
                onPress={() =>
                  openSOS(
                    "ACTIVE"
                  )
                }
              />

              <StatusCard
                title="Cancelled SOS"
                count={
                  cancelledSOSCount
                }
                icon="close-circle-outline"
                iconColor={
                  COLORS.textSecondary
                }
                backgroundColor="#F5F3F6"
                onPress={() =>
                  openSOS(
                    "CANCELLED"
                  )
                }
              />
            </View>

            <Pressable
              onPress={() =>
                openSOS()
              }
              className="mt-1 flex-row items-center rounded-3xl border border-app-border bg-white p-5 active:opacity-75"
            >
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9EB]">
                <Ionicons
                  name="alert-circle-outline"
                  size={24}
                  color={
                    COLORS.sos
                  }
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-base font-bold text-app-text">
                  All SOS Events
                </Text>

                <Text className="mt-1 text-sm text-app-muted">
                  {sosRecords.length} total emergency events
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#A995B5"
              />
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}