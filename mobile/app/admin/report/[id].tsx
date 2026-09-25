import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import ScreenHeader from "../../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../../src/constants/theme";

import {
  getAdminIncident,
  updateAdminIncidentStatus,
} from "../../../src/services/adminService";

import {
  getAdminEvidenceUrls,
} from "../../../src/services/adminEvidenceService";

import type {
  AdminIncident,
  AdminReviewStatus,
} from "../../../src/services/adminService";

export default function AdminReportDetailsScreen() {
  const {
    id,
  } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [
    incident,
    setIncident,
  ] =
    useState<
      AdminIncident | null
    >(null);

  const [
    evidenceUrls,
    setEvidenceUrls,
  ] =
    useState<string[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    evidenceLoading,
    setEvidenceLoading,
  ] =
    useState(false);

  const [
    updating,
    setUpdating,
  ] =
    useState(false);

  const loadIncident =
    useCallback(
      async () => {
        if (!id) {
          return;
        }

        try {
          setLoading(true);

          const response =
            await getAdminIncident(
              id
            );

          setIncident(
            response.data
          );

          const paths =
            response.data
              .evidencePaths ??
            [];

          if (
            paths.length > 0
          ) {
            try {
              setEvidenceLoading(
                true
              );

              const urls =
                await getAdminEvidenceUrls(
                  paths
                );

              setEvidenceUrls(
                urls
              );
            } catch (
              evidenceError
            ) {
              console.error(
                "Evidence loading error:",
                evidenceError
              );

              setEvidenceUrls(
                []
              );
            } finally {
              setEvidenceLoading(
                false
              );
            }
          } else {
            setEvidenceUrls(
              []
            );

            setEvidenceLoading(
              false
            );
          }
        } catch (error) {
          console.error(
            "Admin report loading error:",
            error
          );

          Alert.alert(
            "Error",
            error instanceof Error
              ? error.message
              : "Unable to load report."
          );
        } finally {
          setLoading(false);
        }
      },
      [id]
    );

  useEffect(() => {
    loadIncident();
  }, [loadIncident]);

  const handleStatusUpdate =
    (
      status:
        AdminReviewStatus
    ) => {
      if (!incident) {
        return;
      }

      const title =
        status ===
        "Verified"
          ? "Verify Report"
          : "Reject Report";

      const message =
        status ===
        "Verified"
          ? "Are you sure you want to verify this report?"
          : "Are you sure you want to reject this report?";

      Alert.alert(
        title,
        message,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text:
              status ===
              "Verified"
                ? "Verify"
                : "Reject",

            style:
              status ===
              "Rejected"
                ? "destructive"
                : "default",

            onPress:
              async () => {
                try {
                  setUpdating(
                    true
                  );

                  await updateAdminIncidentStatus(
                    incident.id,
                    status
                  );

                  await loadIncident();
                } catch (
                  error
                ) {
                  Alert.alert(
                    "Update Failed",
                    error instanceof Error
                      ? error.message
                      : "Unable to update report."
                  );
                } finally {
                  setUpdating(
                    false
                  );
                }
              },
          },
        ]
      );
    };

  const getStatusColor =
    () => {
      switch (
        incident?.status
      ) {
        case "Verified":
          return COLORS.success;

        case "Rejected":
          return COLORS.error;

        case "Cancelled":
          return COLORS.textSecondary;

        default:
          return "#F59E0B";
      }
    };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={
              COLORS.primary
            }
          />

          <Text className="mt-4 text-app-muted">
            Loading report...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!incident) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title="Report Details" />

          <View className="flex-1 items-center justify-center">
            <Text className="text-app-muted">
              Report not found.
            </Text>

            <Pressable
              onPress={() =>
                router.back()
              }
              className="mt-4"
            >
              <Text className="font-semibold text-primary">
                Go Back
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const canReview =
    incident.status ===
    "Pending Review";

  const evidencePaths =
    incident.evidencePaths ??
    [];

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
          paddingBottom: 50,
        }}
      >
        <ScreenHeader title="Report Review" />

        <View className="mt-4 flex-row items-center justify-between rounded-3xl border border-app-border bg-white p-5">
          <View>
            <Text className="text-xs font-semibold uppercase text-app-muted">
              Status
            </Text>

            <Text
              style={{
                color:
                  getStatusColor(),
              }}
              className="mt-2 text-base font-bold"
            >
              {incident.status}
            </Text>
          </View>

          <View
            style={{
              backgroundColor:
                `${getStatusColor()}18`,
            }}
            className="h-12 w-12 items-center justify-center rounded-full"
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={
                getStatusColor()
              }
            />
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <Text className="text-xs font-semibold uppercase text-app-muted">
            Incident Type
          </Text>

          <Text className="mt-2 text-lg font-bold text-app-text">
            {
              incident.category
            }
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <Text className="text-xs font-semibold uppercase text-app-muted">
            Description
          </Text>

          <Text className="mt-3 text-sm leading-6 text-app-text">
            {
              incident.description
            }
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={21}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Location
            </Text>
          </View>

          <Text className="mt-3 text-sm text-app-text">
            {incident.latitude.toFixed(
              6
            )}
            ,{" "}
            {incident.longitude.toFixed(
              6
            )}
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={21}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Incident Date
            </Text>
          </View>

          <Text className="mt-3 text-sm text-app-text">
            {new Date(
              incident.incidentDatetime
            ).toLocaleString()}
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name="images-outline"
              size={22}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Incident Evidence
            </Text>
          </View>

          {evidencePaths.length ===
          0 ? (
            <Text className="mt-4 text-sm text-app-muted">
              No evidence photos were attached to this report.
            </Text>
          ) : evidenceLoading ? (
            <View className="mt-5 items-center">
              <ActivityIndicator
                color={
                  COLORS.primary
                }
              />

              <Text className="mt-2 text-xs text-app-muted">
                Loading evidence...
              </Text>
            </View>
          ) : evidenceUrls.length ===
            0 ? (
            <View className="mt-4 rounded-2xl bg-light-purple p-4">
              <Text className="text-sm text-app-muted">
                Evidence exists, but the images could not be loaded.
              </Text>

              <Pressable
                onPress={
                  loadIncident
                }
              >
                <Text className="mt-2 font-semibold text-primary">
                  Try Again
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text className="mt-3 text-sm text-app-muted">
                {
                  evidenceUrls.length
                }{" "}
                {evidenceUrls.length ===
                1
                  ? "photo"
                  : "photos"}{" "}
                attached
              </Text>

              <View className="mt-4 gap-4">
                {evidenceUrls.map(
                  (
                    url,
                    index
                  ) => (
                    <View
                      key={`${url}-${index}`}
                      className="overflow-hidden rounded-2xl border border-app-border bg-white"
                    >
                      <Image
                        source={{
                          uri: url,
                        }}
                        style={{
                          width:
                            "100%",
                          height:
                            220,
                        }}
                        resizeMode="cover"
                      />

                      <View className="p-3">
                        <Text className="text-xs font-medium text-app-muted">
                          Evidence{" "}
                          {index +
                            1}
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            </>
          )}
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name={
                incident.isAnonymous
                  ? "eye-off-outline"
                  : "person-outline"
              }
              size={21}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Reporter
            </Text>
          </View>

          {incident.isAnonymous ? (
            <>
              <Text className="mt-3 font-semibold text-app-text">
                Anonymous Reporter
              </Text>

              <Text className="mt-1 text-xs leading-5 text-app-muted">
                This report was submitted anonymously.
                Personal identity is hidden from this
                review interface.
              </Text>
            </>
          ) : incident.user ? (
            <>
              <Text className="mt-3 font-semibold text-app-text">
                {
                  incident.user
                    .fullName
                }
              </Text>

              <Text className="mt-1 text-sm text-app-muted">
                {
                  incident.user
                    .email
                }
              </Text>
            </>
          ) : (
            <Text className="mt-3 text-sm text-app-muted">
              Guest report
            </Text>
          )}
        </View>

        {incident.status ===
          "Cancelled" && (
          <View className="mt-4 flex-row rounded-3xl bg-gray-100 p-4">
            <Ionicons
              name="close-circle-outline"
              size={22}
              color={
                COLORS.textSecondary
              }
            />

            <Text className="ml-3 flex-1 text-sm leading-5 text-app-muted">
              The user cancelled this report. No further
              admin review action is available.
            </Text>
          </View>
        )}

        {(incident.status ===
          "Verified" ||
          incident.status ===
            "Rejected") && (
          <View className="mt-4 flex-row rounded-3xl bg-light-purple p-4">
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-3 flex-1 text-sm leading-5 text-app-muted">
              This report has already been reviewed and
              cannot be changed again.
            </Text>
          </View>
        )}

        {canReview && (
          <View className="mt-8 flex-row gap-3">
            <Pressable
              disabled={
                updating
              }
              onPress={() =>
                handleStatusUpdate(
                  "Rejected"
                )
              }
              style={{
                borderColor:
                  COLORS.error,
                opacity:
                  updating
                    ? 0.6
                    : 1,
              }}
              className="flex-1 items-center justify-center rounded-2xl border py-4"
            >
              <Text
                style={{
                  color:
                    COLORS.error,
                }}
                className="font-bold"
              >
                Reject
              </Text>
            </Pressable>

            <Pressable
              disabled={
                updating
              }
              onPress={() =>
                handleStatusUpdate(
                  "Verified"
                )
              }
              style={{
                backgroundColor:
                  COLORS.success,
                opacity:
                  updating
                    ? 0.6
                    : 1,
              }}
              className="flex-1 items-center justify-center rounded-2xl py-4"
            >
              {updating ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text className="font-bold text-white">
                  Verify
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}