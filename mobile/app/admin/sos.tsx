import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  AdminSOS,
  AdminSOSStatus,
  getAdminSOSRecords,
} from "../../src/services/adminSosService";

import {
  COLORS,
} from "../../src/constants/theme";

export default function AdminSOSScreen() {
  const params =
    useLocalSearchParams();

  const initialStatus =
    Array.isArray(params.status)
      ? params.status[0]
      : params.status;

  const [selectedStatus, setSelectedStatus] =
    useState<
      AdminSOSStatus | undefined
    >(
      initialStatus === "ACTIVE" ||
        initialStatus === "CANCELLED"
        ? initialStatus
        : undefined
    );

  const [records, setRecords] =
    useState<AdminSOS[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadSOSRecords =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getAdminSOSRecords(
            selectedStatus
          );

        setRecords(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load SOS records:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load SOS records."
        );
      } finally {
        setLoading(false);
      }
    }, [selectedStatus]);

  useFocusEffect(
    useCallback(() => {
      loadSOSRecords();
    }, [loadSOSRecords])
  );

  const openLocation = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const url =
        `https://maps.google.com/?q=${latitude},${longitude}`;

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Unable to Open Location",
        "The location could not be opened."
      );
    }
  };

  const formatDate = (
    value: string
  ) => {
    return new Date(
      value
    ).toLocaleString();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <View className="flex-row items-center px-5 pb-3 pt-2">
        <Pressable
          onPress={() =>
            router.back()
          }
          className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-70"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={
              COLORS.text
            }
          />
        </Pressable>

        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-app-text">
            Emergency SOS Events
          </Text>

          <Text className="mt-1 text-xs text-app-muted">
            Monitor recorded emergency SOS activity
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 60,
        }}
      >
        <View className="mt-4 flex-row">
          <Pressable
            onPress={() =>
              setSelectedStatus(
                undefined
              )
            }
            className={`mr-2 rounded-full px-5 py-3 ${
              !selectedStatus
                ? "bg-primary"
                : "border border-app-border bg-white"
            }`}
          >
            <Text
              className={
                !selectedStatus
                  ? "font-bold text-white"
                  : "font-semibold text-app-muted"
              }
            >
              All
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setSelectedStatus(
                "ACTIVE"
              )
            }
            className={`mr-2 rounded-full px-5 py-3 ${
              selectedStatus ===
              "ACTIVE"
                ? "bg-sos"
                : "border border-app-border bg-white"
            }`}
          >
            <Text
              className={
                selectedStatus ===
                "ACTIVE"
                  ? "font-bold text-white"
                  : "font-semibold text-app-muted"
              }
            >
              Active
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setSelectedStatus(
                "CANCELLED"
              )
            }
            className={`rounded-full px-5 py-3 ${
              selectedStatus ===
              "CANCELLED"
                ? "bg-primary"
                : "border border-app-border bg-white"
            }`}
          >
            <Text
              className={
                selectedStatus ===
                "CANCELLED"
                  ? "font-bold text-white"
                  : "font-semibold text-app-muted"
              }
            >
              Cancelled
            </Text>
          </Pressable>
        </View>

        <View className="mt-7 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-app-text">
            SOS Records
          </Text>

          {!loading && (
            <Pressable
              onPress={
                loadSOSRecords
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

        {!loading && !error && (
          <Text className="mt-1 text-sm text-app-muted">
            {records.length} event
            {records.length === 1
              ? ""
              : "s"}
          </Text>
        )}

        {loading ? (
          <View className="mt-20 items-center">
            <ActivityIndicator
              size="large"
              color={
                COLORS.primary
              }
            />

            <Text className="mt-3 text-app-muted">
              Loading SOS events...
            </Text>
          </View>
        ) : error ? (
          <View className="mt-12 items-center rounded-3xl border border-app-border bg-white p-6">
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={
                COLORS.error
              }
            />

            <Text className="mt-4 text-lg font-bold text-app-text">
              Unable to load SOS events
            </Text>

            <Text className="mt-2 text-center text-app-muted">
              {error}
            </Text>

            <Pressable
              onPress={
                loadSOSRecords
              }
              className="mt-5 rounded-2xl bg-primary px-6 py-3"
            >
              <Text className="font-bold text-white">
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : records.length ===
          0 ? (
          <View className="mt-16 items-center rounded-3xl border border-app-border bg-white p-8">
            <Ionicons
              name="shield-checkmark-outline"
              size={46}
              color={
                COLORS.primary
              }
            />

            <Text className="mt-4 text-lg font-bold text-app-text">
              No SOS Events
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
              There are no SOS records for this filter.
            </Text>
          </View>
        ) : (
          <View className="mt-4">
            {records.map(
              (item) => (
                <View
                  key={item.id}
                  className="mb-4 rounded-3xl border border-app-border bg-white p-5"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-center">
                      <View
                        className={`h-12 w-12 items-center justify-center rounded-2xl ${
                          item.status ===
                          "ACTIVE"
                            ? "bg-[#FFE9EB]"
                            : "bg-light-purple"
                        }`}
                      >
                        <Ionicons
                          name={
                            item.status ===
                            "ACTIVE"
                              ? "warning-outline"
                              : "checkmark-circle-outline"
                          }
                          size={24}
                          color={
                            item.status ===
                            "ACTIVE"
                              ? COLORS.sos
                              : COLORS.primary
                          }
                        />
                      </View>

                      <View className="ml-3">
                        <Text className="text-base font-bold text-app-text">
                          Emergency SOS
                        </Text>

                        <Text
                          className={`mt-1 text-xs font-bold ${
                            item.status ===
                            "ACTIVE"
                              ? "text-sos"
                              : "text-app-muted"
                          }`}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mt-5 border-t border-app-border pt-4">
                    <Text className="text-xs font-medium uppercase text-app-muted">
                      SOS ID
                    </Text>

                    <Text className="mt-1 text-xs text-app-text">
                      {item.id}
                    </Text>

                    <Text className="mt-4 text-xs font-medium uppercase text-app-muted">
                      Activated
                    </Text>

                    <Text className="mt-1 text-sm text-app-text">
                      {formatDate(
                        item.activatedAt
                      )}
                    </Text>

                    {item.cancelledAt && (
                      <>
                        <Text className="mt-4 text-xs font-medium uppercase text-app-muted">
                          Cancelled
                        </Text>

                        <Text className="mt-1 text-sm text-app-text">
                          {formatDate(
                            item.cancelledAt
                          )}
                        </Text>
                      </>
                    )}

                    <Text className="mt-4 text-xs font-medium uppercase text-app-muted">
                      Location
                    </Text>

                    <Text className="mt-1 text-sm text-app-text">
                      {item.latitude},{" "}
                      {item.longitude}
                    </Text>

                    {item.message && (
                      <>
                        <Text className="mt-4 text-xs font-medium uppercase text-app-muted">
                          Emergency Message
                        </Text>

                        <Text className="mt-1 text-sm leading-5 text-app-text">
                          {item.message}
                        </Text>
                      </>
                    )}
                  </View>

                  <Pressable
                    onPress={() =>
                      openLocation(
                        item.latitude,
                        item.longitude
                      )
                    }
                    className="mt-5 flex-row items-center justify-center rounded-2xl bg-primary py-4 active:opacity-80"
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text className="ml-2 font-bold text-white">
                      View Location
                    </Text>
                  </Pressable>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}