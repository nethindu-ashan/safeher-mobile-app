import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../src/components/EmptyState";
import PrimaryButton from "../../src/components/PrimaryButton";
import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";

import {
  cancelMyReport,
  getMyReports,
  MyIncident,
} from "../../src/services/myReportsService";

export default function ReportsScreen() {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [reports, setReports] =
    useState<MyIncident[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [
    cancellingId,
    setCancellingId,
  ] = useState<string | null>(
    null
  );

  const loadReports = useCallback(
    async (
      showLoading = true
    ) => {
      if (!isAuthenticated) {
        setReports([]);
        setLoading(false);
        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }

        setError(null);

        const response =
          await getMyReports();

        setReports(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (err) {
        console.error(
          "Unable to load My Reports:",
          err
        );

        setReports([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your reports."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isAuthenticated]
  );

  useFocusEffect(
    useCallback(() => {
      if (!authLoading) {
        loadReports();
      }
    }, [
      authLoading,
      loadReports,
    ])
  );

  const handleRefresh =
    async () => {
      setRefreshing(true);

      await loadReports(false);
    };

  const formatDate = (
    value: string
  ) => {
    return new Date(
      value
    ).toLocaleString();
  };

  const getStatusColor = (
    status: string
  ) => {
    const cleanStatus =
      status.toLowerCase();

    if (
      cleanStatus.includes(
        "verified"
      ) ||
      cleanStatus.includes(
        "resolved"
      )
    ) {
      return COLORS.success;
    }

    if (
      cleanStatus.includes(
        "rejected"
      )
    ) {
      return COLORS.error;
    }

    if (
      cleanStatus.includes(
        "cancelled"
      )
    ) {
      return COLORS.textSecondary;
    }

    return "#E59B16";
  };

  const confirmCancelReport = (
    report: MyIncident
  ) => {
    Alert.alert(
      "Cancel Report",
      "Are you sure you want to cancel this report? Cancelled reports will remain in your history and cannot continue through the review process.",
      [
        {
          text: "Keep Report",
          style: "cancel",
        },
        {
          text: "Cancel Report",
          style: "destructive",

          onPress: () =>
            handleCancelReport(
              report
            ),
        },
      ]
    );
  };

  const handleCancelReport =
    async (
      report: MyIncident
    ) => {
      try {
        setCancellingId(
          report.id
        );

        const response =
          await cancelMyReport(
            report.id
          );

        setReports(
          (currentReports) =>
            currentReports.map(
              (item) =>
                item.id ===
                report.id
                  ? response.data
                  : item
            )
        );

        Alert.alert(
          "Report Cancelled",
          "Your report has been cancelled successfully."
        );
      } catch (error) {
        Alert.alert(
          "Unable to Cancel",
          error instanceof Error
            ? error.message
            : "Unable to cancel this report."
        );
      } finally {
        setCancellingId(
          null
        );
      }
    };

  if (authLoading) {
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
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5 pt-4">
          <Text className="text-2xl font-bold text-app-text">
            My Reports
          </Text>

          <Text className="mt-1 text-app-muted">
            Your incident reports
          </Text>

          <View className="flex-1 items-center justify-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="person-outline"
                size={34}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Text className="mt-5 text-xl font-bold text-app-text">
              Sign in to view
              reports
            </Text>

            <Text className="mt-2 px-8 text-center leading-6 text-app-muted">
              Your personal report
              history is available
              after you sign in to
              your SafeHer account.
            </Text>

            <Pressable
              onPress={() =>
                router.push(
                  "/auth/sign-in"
                )
              }
              className="mt-6 rounded-2xl bg-primary px-8 py-4"
            >
              <Text className="font-bold text-white">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <View className="flex-1">
        <View className="px-5 pt-4">
          <Text className="text-2xl font-bold text-app-text">
            My Reports
          </Text>

          <Text className="mt-1 text-app-muted">
            View and track your
            submitted incident
            reports
          </Text>
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
              Loading your
              reports...
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
        ) : reports.length ===
          0 ? (
          <View className="flex-1 justify-center px-5">
            <EmptyState message="You have not submitted any reports yet." />
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
              paddingBottom: 120,
            }}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-semibold text-app-muted">
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

            {reports.map(
              (report) => {
                const canCancel =
                  report.status ===
                  "Pending Review";

                const isCancelling =
                  cancellingId ===
                  report.id;

                return (
                  <View
                    key={
                      report.id
                    }
                    className="mb-4 rounded-3xl border border-app-border bg-white p-5"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="mr-3 flex-1 flex-row items-center">
                        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-light-purple">
                          <Ionicons
                            name="document-text-outline"
                            size={22}
                            color={
                              COLORS.primary
                            }
                          />
                        </View>

                        <View className="ml-3 flex-1">
                          <Text className="text-base font-bold text-app-text">
                            {
                              report.category
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-app-muted">
                            {formatDate(
                              report.incidentDatetime
                            )}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          borderRadius:
                            999,
                          paddingHorizontal:
                            10,
                          paddingVertical:
                            6,
                          backgroundColor:
                            `${getStatusColor(
                              report.status
                            )}15`,
                        }}
                      >
                        <Text
                          style={{
                            fontSize:
                              11,
                            fontWeight:
                              "700",
                            color:
                              getStatusColor(
                                report.status
                              ),
                          }}
                        >
                          {
                            report.status
                          }
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-4 text-sm leading-6 text-app-text">
                      {
                        report.description
                      }
                    </Text>

                    <View className="mt-4 flex-row items-center">
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
                          ? "Submitted anonymously"
                          : "Submitted with your profile"}
                      </Text>
                    </View>

                    <View className="mt-4 border-t border-app-border pt-3">
                      <Text className="text-xs text-app-muted">
                        Report ID:{" "}
                        {report.id.slice(
                          0,
                          8
                        )}
                      </Text>
                    </View>

                    {/* CANCEL */}
                    {canCancel && (
                      <Pressable
                        disabled={
                          isCancelling
                        }
                        onPress={() =>
                          confirmCancelReport(
                            report
                          )
                        }
                        className="mt-4 flex-row items-center justify-center rounded-2xl border border-red-200 bg-white py-3.5 active:opacity-70"
                      >
                        {isCancelling ? (
                          <ActivityIndicator
                            color={
                              COLORS.error
                            }
                          />
                        ) : (
                          <>
                            <Ionicons
                              name="close-circle-outline"
                              size={
                                19
                              }
                              color={
                                COLORS.error
                              }
                            />

                            <Text
                              className="ml-2 font-bold"
                              style={{
                                color:
                                  COLORS.error,
                              }}
                            >
                              Cancel
                              Report
                            </Text>
                          </>
                        )}
                      </Pressable>
                    )}

                    {report.status ===
                      "Cancelled" && (
                      <View className="mt-4 flex-row items-center rounded-2xl bg-gray-50 px-4 py-3">
                        <Ionicons
                          name="information-circle-outline"
                          size={18}
                          color={
                            COLORS.textSecondary
                          }
                        />

                        <Text className="ml-2 flex-1 text-xs leading-5 text-app-muted">
                          This
                          report was
                          cancelled and
                          is no longer
                          awaiting
                          review.
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            )}
          </ScrollView>
        )}

        <View
          style={{
            backgroundColor:
              COLORS.background,
          }}
          className="absolute bottom-0 left-0 right-0 border-t border-app-border px-5 pb-5 pt-3"
        >
          <PrimaryButton
            title="Report an Incident"
            onPress={() =>
              router.push(
                "/report"
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}