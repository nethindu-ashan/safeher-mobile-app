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
  Pressable,
  RefreshControl,
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

type FilterType =
  | "All"
  | IncidentStatus;

const FILTERS: FilterType[] = [
  "All",
  "Pending Review",
  "Verified",
  "Rejected",
  "Cancelled",
];

export default function AdminReportsScreen() {
  const params =
    useLocalSearchParams<{
      status?: string;
    }>();

  const initialFilter: FilterType =
    FILTERS.includes(
      params.status as FilterType
    )
      ? (params.status as FilterType)
      : "All";

  const [
    selectedFilter,
    setSelectedFilter,
  ] =
    useState<FilterType>(
      initialFilter
    );

  const [reports, setReports] =
    useState<AdminIncident[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadReports = useCallback(
    async (
      filter: FilterType =
        selectedFilter,
      showLoading = true
    ) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError(null);

        const response =
          await getAdminIncidents(
            filter === "All"
              ? undefined
              : filter
          );

        setReports(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load admin reports:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load reports."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedFilter]
  );

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const changeFilter = (
    filter: FilterType
  ) => {
    setSelectedFilter(filter);
    loadReports(filter);
  };

  const handleRefresh =
    async () => {
      setRefreshing(true);

      await loadReports(
        selectedFilter,
        false
      );
    };

  const getStatusStyle = (
    status: string
  ) => {
    if (
      status === "Verified"
    ) {
      return {
        color:
          COLORS.success,
        background:
          "#ECFDF5",
      };
    }

    if (
      status === "Rejected"
    ) {
      return {
        color: COLORS.error,
        background:
          "#FEF2F2",
      };
    }

    if (
      status === "Cancelled"
    ) {
      return {
        color:
          COLORS.textSecondary,
        background:
          "#F5F3F6",
      };
    }

    return {
      color: "#E59B16",
      background: "#FFF7E7",
    };
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 pt-3">
          <Text className="text-2xl font-bold text-app-text">
            Incident Reports
          </Text>

          <Text className="mt-1 text-sm text-app-muted">
            Review and manage
            submitted safety
            reports
          </Text>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            className="mt-6"
          >
            {FILTERS.map(
              (filter) => {
                const active =
                  selectedFilter ===
                  filter;

                return (
                  <Pressable
                    key={filter}
                    onPress={() =>
                      changeFilter(
                        filter
                      )
                    }
                    style={{
                      backgroundColor:
                        active
                          ? COLORS.primary
                          : "#FFFFFF",
                    }}
                    className="mr-3 rounded-full border border-app-border px-4 py-2.5"
                  >
                    <Text
                      style={{
                        color: active
                          ? "#FFFFFF"
                          : COLORS.textSecondary,
                        fontWeight:
                          "700",
                      }}
                    >
                      {filter ===
                      "Pending Review"
                        ? "Pending"
                        : filter}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </ScrollView>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={
                COLORS.primary
              }
            />

            <Text className="mt-3 text-app-muted">
              Loading reports...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={
                COLORS.error
              }
            />

            <Text className="mt-4 text-lg font-bold text-app-text">
              Unable to load
              reports
            </Text>

            <Text className="mt-2 text-center text-app-muted">
              {error}
            </Text>

            <Pressable
              onPress={() =>
                loadReports()
              }
              className="mt-5 rounded-2xl bg-primary px-6 py-3"
            >
              <Text className="font-bold text-white">
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            className="mt-5 flex-1 px-5"
            showsVerticalScrollIndicator={
              false
            }
            refreshControl={
              <RefreshControl
                refreshing={
                  refreshing
                }
                onRefresh={
                  handleRefresh
                }
              />
            }
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-app-muted">
                {reports.length}{" "}
                {reports.length ===
                1
                  ? "report"
                  : "reports"}
              </Text>

              <Pressable
                onPress={
                  handleRefresh
                }
              >
                <Ionicons
                  name="refresh-outline"
                  size={21}
                  color={
                    COLORS.primary
                  }
                />
              </Pressable>
            </View>

            {reports.length ===
            0 ? (
              <View className="mt-20 items-center">
                <Ionicons
                  name="documents-outline"
                  size={50}
                  color={
                    COLORS.textSecondary
                  }
                />

                <Text className="mt-4 text-lg font-bold text-app-text">
                  No reports
                  found
                </Text>

                <Text className="mt-2 text-center text-app-muted">
                  No reports match
                  this status.
                </Text>
              </View>
            ) : (
              reports.map(
                (report) => {
                  const statusStyle =
                    getStatusStyle(
                      report.status
                    );

                  return (
                    <Pressable
                      key={
                        report.id
                      }
                      onPress={() =>
                        router.push({
                          pathname:
                            "/admin/report/[id]",
                          params: {
                            id: report.id,
                          },
                        })
                      }
                      className="mb-4 rounded-3xl border border-app-border bg-white p-5 active:opacity-75"
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="mr-3 flex-1">
                          <Text className="text-base font-bold text-app-text">
                            {
                              report.category
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-app-muted">
                            {new Date(
                              report.incidentDatetime
                            ).toLocaleString()}
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor:
                              statusStyle.background,
                          }}
                          className="rounded-full px-3 py-1.5"
                        >
                          <Text
                            style={{
                              color:
                                statusStyle.color,
                              fontSize:
                                11,
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              report.status
                            }
                          </Text>
                        </View>
                      </View>

                      <Text
                        numberOfLines={
                          2
                        }
                        className="mt-4 text-sm leading-5 text-app-muted"
                      >
                        {
                          report.description
                        }
                      </Text>

                      <View className="mt-4 flex-row items-center justify-between border-t border-app-border pt-4">
                        <View className="flex-row items-center">
                          <Ionicons
                            name={
                              report.isAnonymous
                                ? "eye-off-outline"
                                : "person-outline"
                            }
                            size={17}
                            color={
                              COLORS.textSecondary
                            }
                          />

                          <Text className="ml-2 text-xs text-app-muted">
                            {report.isAnonymous
                              ? "Anonymous reporter"
                              : report
                                  .user
                                  ?.fullName ||
                                "Registered user"}
                          </Text>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#A995B5"
                        />
                      </View>
                    </Pressable>
                  );
                }
              )
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}