import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useEffect,
  useState,
} from "react";

import {
  cancelSOS,
} from "../../src/services/sosService";

import {
  getPrimaryTrustedContact,
} from "../../src/services/trustedContactService";

import type {
  TrustedContact,
} from "../../src/services/trustedContactService";

import {
  useAuth,
} from "../../src/context/AuthContext";

import {
  COLORS,
} from "../../src/constants/theme";

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND = "#FFFBFD";

const SOS_RED = "#D92D20";

const SOS_RED_SOFT = "#FFF1F0";

const GREEN = "#168447";

/* ============================================================
   SCREEN
   ============================================================ */

export default function SOSActiveScreen() {
  /* ==========================================================
     PARAMS
     ========================================================== */

  const {
    id,
    latitude,
    longitude,
    status,
  } = useLocalSearchParams();

  /* ==========================================================
     AUTH
     ========================================================== */

  const {
    isAuthenticated,
  } = useAuth();

  /* ==========================================================
     STATE
     ========================================================== */

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const [
    contactLoading,
    setContactLoading,
  ] = useState(false);

  const [
    primaryContact,
    setPrimaryContact,
  ] =
    useState<TrustedContact | null>(
      null
    );

  /* ==========================================================
     PARAM VALUES
     ========================================================== */

  const sosId =
    Array.isArray(id)
      ? id[0]
      : id;

  const latitudeValue =
    Array.isArray(latitude)
      ? latitude[0]
      : latitude;

  const longitudeValue =
    Array.isArray(longitude)
      ? longitude[0]
      : longitude;

  const statusValue =
    Array.isArray(status)
      ? status[0]
      : status;

  /* ==========================================================
     LOAD TRUSTED CONTACT
     ========================================================== */

  useEffect(() => {
    if (!isAuthenticated) {
      setPrimaryContact(null);

      return;
    }

    const loadPrimaryContact =
      async () => {
        try {
          setContactLoading(
            true
          );

          const contact =
            await getPrimaryTrustedContact();

          setPrimaryContact(
            contact
          );
        } catch (error) {
          console.log(
            "Unable to load primary trusted contact:",
            error
          );

          setPrimaryContact(
            null
          );
        } finally {
          setContactLoading(
            false
          );
        }
      };

    loadPrimaryContact();
  }, [
    isAuthenticated,
  ]);

  /* ==========================================================
     LOCATION
     ========================================================== */

  const locationLink =
    latitudeValue &&
    longitudeValue
      ? `https://maps.google.com/?q=${latitudeValue},${longitudeValue}`
      : "";

  const handleOpenLocation =
    async () => {
      if (!locationLink) {
        return;
      }

      try {
        await Linking.openURL(
          locationLink
        );
      } catch {
        Alert.alert(
          "Unable to Open Location",
          "Google Maps could not be opened."
        );
      }
    };

  /* ==========================================================
     EMERGENCY MESSAGE
     ========================================================== */

  const emergencyMessage =
    locationLink
      ? `Emergency! I may need help. Please contact me immediately. My current location: ${locationLink}`
      : "Emergency! I may need help. Please contact me immediately.";

  /* ==========================================================
     CALL
     ========================================================== */

  const handleCall =
    async () => {
      if (!primaryContact) {
        return;
      }

      try {
        await Linking.openURL(
          `tel:${primaryContact.phone}`
        );
      } catch {
        Alert.alert(
          "Unable to Call",
          "Your phone could not open the call application."
        );
      }
    };

  /* ==========================================================
     SMS
     ========================================================== */

  const handleSMS =
    async () => {
      if (!primaryContact) {
        return;
      }

      try {
        const separator =
          Platform.OS === "ios"
            ? "&"
            : "?";

        const url =
          `sms:${primaryContact.phone}${separator}body=${encodeURIComponent(
            emergencyMessage
          )}`;

        await Linking.openURL(
          url
        );
      } catch {
        Alert.alert(
          "Unable to Open SMS",
          "Your phone could not open the messaging application."
        );
      }
    };

  /* ==========================================================
     WHATSAPP
     ========================================================== */

  const handleWhatsApp =
    async () => {
      if (!primaryContact) {
        return;
      }

      try {
        let phone =
          primaryContact.phone.replace(
            /\D/g,
            ""
          );

        if (
          phone.startsWith("0") &&
          phone.length === 10
        ) {
          phone =
            `94${phone.substring(1)}`;
        }

        const url =
          `https://wa.me/${phone}?text=${encodeURIComponent(
            emergencyMessage
          )}`;

        await Linking.openURL(
          url
        );
      } catch {
        Alert.alert(
          "Unable to Open WhatsApp",
          "WhatsApp could not be opened on this device."
        );
      }
    };

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  const handleManageContacts =
    () => {
      router.push(
        "/trusted-contacts"
      );
    };

  const handleSignIn =
    () => {
      router.push(
        "/auth/sign-in"
      );
    };

  /* ==========================================================
     CANCEL SOS
     ========================================================== */

  const handleCancelSOS =
    () => {
      Alert.alert(
        "Cancel Emergency SOS?",
        "Are you sure you want to stop the active SOS alert?",
        [
          {
            text:
              "Keep SOS Active",

            style:
              "cancel",
          },

          {
            text:
              "Cancel SOS",

            style:
              "destructive",

            onPress:
              confirmCancelSOS,
          },
        ]
      );
    };

  const confirmCancelSOS =
    async () => {
      if (!sosId) {
        Alert.alert(
          "Error",
          "SOS ID is missing."
        );

        return;
      }

      try {
        setCancelling(
          true
        );

        await cancelSOS(
          sosId
        );

        router.replace({
          pathname:
            "/report/sos-cancelled",

          params: {
            id:
              sosId,
          },
        });
      } catch (error) {
        console.error(
          "SOS cancellation error:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Unable to cancel SOS.";

        Alert.alert(
          "Cancellation Failed",
          message
        );
      } finally {
        setCancelling(
          false
        );
      }
    };

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <SafeAreaView
      edges={[
        "top",
        "bottom",
      ]}
      className="flex-1"
      style={{
        backgroundColor:
          BACKGROUND,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          BACKGROUND
        }
      />

      {/* ==================================================
          CONTENT
          ================================================== */}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 20,

          paddingTop: 18,

          paddingBottom:
            primaryContact
              ? 180
              : 125,
        }}
      >
        {/* =================================================
            SIMPLE SOS HEADER
            ================================================= */}

        <View className="flex-row items-center">
          <View
            className="h-11 w-11 items-center justify-center rounded-[14px]"
            style={{
              backgroundColor:
                SOS_RED_SOFT,
            }}
          >
            <Ionicons
              name="warning"
              size={22}
              color={
                SOS_RED
              }
            />
          </View>

          <View className="ml-3 flex-1">
            <Text
              className="text-[8px] font-bold uppercase tracking-[1px]"
              style={{
                color:
                  SOS_RED,
              }}
            >
              Emergency
            </Text>

            <Text className="mt-0.5 text-[19px] font-bold text-app-text">
              SOS Active
            </Text>
          </View>

          <View className="flex-row items-center rounded-full bg-[#ECFDF3] px-2.5 py-1.5">
            <View
              className="mr-1.5 h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  GREEN,
              }}
            />

            <Text
              className="text-[7.5px] font-bold"
              style={{
                color:
                  GREEN,
              }}
            >
              {statusValue ??
                "ACTIVE"}
            </Text>
          </View>
        </View>

        {/* =================================================
            SMALL SOS SUMMARY
            ================================================= */}

        <View className="mt-4 rounded-[14px] bg-[#F7F3F5] px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={14}
              color="#817888"
            />

            <Text className="ml-2 text-[9px] font-medium text-app-muted">
              Location shared
            </Text>

            {locationLink ? (
              <Pressable
                onPress={
                  handleOpenLocation
                }
                className="ml-auto"
              >
                <Text className="text-[8.5px] font-semibold text-primary">
                  View location
                </Text>
              </Pressable>
            ) : null}
          </View>

          {sosId ? (
            <Text
              numberOfLines={1}
              className="mt-2 text-[8px] text-[#9B929D]"
            >
              SOS ID: {sosId}
            </Text>
          ) : null}
        </View>

        {/* =================================================
            TRUSTED CONTACT - MAIN FOCUS
            ================================================= */}

        <View className="mt-7">
          <Text className="text-[18px] font-bold text-app-text">
            Contact someone you trust
          </Text>

          <Text className="mt-1 text-[9.5px] leading-[14px] text-app-muted">
            Your primary emergency contact
            is ready below.
          </Text>

          {/* =================================================
              LOADING
              ================================================= */}

          {contactLoading ? (
            <View className="mt-4 items-center rounded-[20px] border border-[#F0D4D2] bg-white py-8">
              <ActivityIndicator
                size="small"
                color={
                  SOS_RED
                }
              />

              <Text className="mt-3 text-[9.5px] text-app-muted">
                Loading trusted contact...
              </Text>
            </View>
          ) : !isAuthenticated ? (
            /* =============================================
               NOT SIGNED IN
               ============================================= */

            <View className="mt-4 rounded-[20px] border border-[#F0D4D2] bg-white p-5">
              <View className="items-center">
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      SOS_RED_SOFT,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={25}
                    color={
                      SOS_RED
                    }
                  />
                </View>

                <Text className="mt-3 text-[13px] font-bold text-app-text">
                  No trusted contact available
                </Text>

                <Text className="mt-1 text-center text-[9px] leading-[13px] text-app-muted">
                  Sign in to access your
                  saved emergency contacts.
                </Text>
              </View>
            </View>
          ) : primaryContact ? (
            /* =============================================
               PRIMARY CONTACT
               ============================================= */

            <View
              className="mt-4 rounded-[22px] bg-white p-5"
              style={{
                borderWidth: 1.5,

                borderColor:
                  "#EFBFBB",
              }}
            >
              {/* CONTACT HEADER */}

              <View className="items-center">
                <View
                  className="h-[66px] w-[66px] items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      SOS_RED_SOFT,
                  }}
                >
                  <Ionicons
                    name="person"
                    size={29}
                    color={
                      SOS_RED
                    }
                  />
                </View>

                <View
                  className="mt-3 rounded-full px-2.5 py-1"
                  style={{
                    backgroundColor:
                      SOS_RED_SOFT,
                  }}
                >
                  <Text
                    className="text-[7px] font-bold uppercase tracking-[0.8px]"
                    style={{
                      color:
                        SOS_RED,
                    }}
                  >
                    Primary Contact
                  </Text>
                </View>

                <Text
                  numberOfLines={1}
                  className="mt-3 text-[18px] font-bold text-app-text"
                >
                  {primaryContact.name}
                </Text>

                {primaryContact.relationship ? (
                  <Text className="mt-1 text-[9.5px] text-app-muted">
                    {primaryContact.relationship}
                  </Text>
                ) : null}

                <Text className="mt-1.5 text-[11px] font-semibold text-app-text">
                  {primaryContact.phone}
                </Text>
              </View>
            </View>
          ) : (
            /* =============================================
               NO CONTACT
               ============================================= */

            <View className="mt-4 rounded-[20px] border border-[#F0D4D2] bg-white p-5">
              <View className="items-center">
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      SOS_RED_SOFT,
                  }}
                >
                  <Ionicons
                    name="people-outline"
                    size={25}
                    color={
                      SOS_RED
                    }
                  />
                </View>

                <Text className="mt-3 text-[13px] font-bold text-app-text">
                  No primary contact
                </Text>

                <Text className="mt-1 max-w-[230px] text-center text-[9px] leading-[13px] text-app-muted">
                  Add one primary trusted
                  contact for faster access
                  during emergencies.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* =================================================
            CANCEL SOS
            ================================================= */}

        <View className="mt-7 items-center">
          <Pressable
            onPress={
              handleCancelSOS
            }
            disabled={
              cancelling
            }
            className="flex-row items-center px-4 py-2.5"
            style={({
              pressed,
            }) => ({
              opacity:
                cancelling
                  ? 0.4
                  : pressed
                  ? 0.6
                  : 1,
            })}
          >
            {cancelling ? (
              <ActivityIndicator
                size="small"
                color="#8A8186"
              />
            ) : (
              <Ionicons
                name="close-circle-outline"
                size={16}
                color="#8A8186"
              />
            )}

            <Text className="ml-1.5 text-[9.5px] font-medium text-[#8A8186]">
              {cancelling
                ? "Cancelling..."
                : "Cancel SOS"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ==================================================
          FIXED HELP ACTIONS
          ================================================== */}

      <View className="border-t border-[#EDE6F0] bg-white px-4 pb-3 pt-3">
        {primaryContact ? (
          <>
            {/* ===============================================
                CALL NOW
                =============================================== */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Call ${primaryContact.name}`}
              onPress={
                handleCall
              }
              className="h-[60px] flex-row items-center justify-center rounded-[18px] active:opacity-85"
              style={{
                backgroundColor:
                  SOS_RED,
              }}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <Ionicons
                  name="call"
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              <View className="ml-3">
                <Text className="text-[14px] font-bold text-white">
                  Call {primaryContact.name}
                </Text>

                <Text className="mt-0.5 text-[8px] text-white/85">
                  Tap to call now
                </Text>
              </View>
            </Pressable>

            {/* ===============================================
                SMS / WHATSAPP
                =============================================== */}

            <View className="mt-2.5 flex-row">
              <Pressable
                onPress={
                  handleSMS
                }
                className="mr-1.5 h-[46px] flex-1 flex-row items-center justify-center rounded-[14px] border border-[#DED5E4] bg-white active:opacity-70"
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={17}
                  color={
                    COLORS.primary
                  }
                />

                <Text className="ml-2 text-[10.5px] font-semibold text-primary">
                  SMS
                </Text>
              </Pressable>

              <Pressable
                onPress={
                  handleWhatsApp
                }
                className="ml-1.5 h-[46px] flex-1 flex-row items-center justify-center rounded-[14px] border border-[#DED5E4] bg-white active:opacity-70"
              >
                <Ionicons
                  name="logo-whatsapp"
                  size={18}
                  color={
                    COLORS.primary
                  }
                />

                <Text className="ml-2 text-[10.5px] font-semibold text-primary">
                  WhatsApp
                </Text>
              </Pressable>
            </View>
          </>
        ) : contactLoading ? (
          /* =================================================
             LOADING
             ================================================= */

          <View className="h-[56px] flex-row items-center justify-center rounded-[17px] bg-[#FFF1F0]">
            <ActivityIndicator
              size="small"
              color={
                SOS_RED
              }
            />

            <Text
              className="ml-2 text-[10px] font-semibold"
              style={{
                color:
                  SOS_RED,
              }}
            >
              Loading contact...
            </Text>
          </View>
        ) : !isAuthenticated ? (
          /* =================================================
             SIGN IN
             ================================================= */

          <Pressable
            onPress={
              handleSignIn
            }
            className="h-[56px] flex-row items-center justify-center rounded-[17px] active:opacity-85"
            style={{
              backgroundColor:
                SOS_RED,
            }}
          >
            <Ionicons
              name="log-in-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text className="ml-2 text-[12px] font-bold text-white">
              Sign In for Trusted Contacts
            </Text>
          </Pressable>
        ) : (
          /* =================================================
             ADD CONTACT
             ================================================= */

          <Pressable
            onPress={
              handleManageContacts
            }
            className="h-[56px] flex-row items-center justify-center rounded-[17px] active:opacity-85"
            style={{
              backgroundColor:
                SOS_RED,
            }}
          >
            <Ionicons
              name="person-add-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text className="ml-2 text-[12px] font-bold text-white">
              Add Trusted Contact
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}